import React, { useState, useEffect, useRef } from "react";
import { __ } from "services/Translator";
import { Badge, Table, Modal, Collapse } from "react-bootstrap";
import api from "services/api";
import { Redirect, Route, Link, useParams, useHistory } from "react-router-dom";


const SearchBox = (props) => {
  const history = useHistory();
  const [searchStr, setSearchStr] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const searchTextBox = useRef(null);

  // expand searcbar
  const [expandSearchBar, setExpandSearchBar] = useState(true);

  const toggleExpandedSearchBar = (force) => {
    if (expandSearchBar) {
      setSearchSuggestions([]);
      if (force === true) {
        setSearchStr("");
        setExpandSearchBar(false);
      } else {
        if (searchStr.length === 0) {
          setExpandSearchBar(false);
        }
      }
    } else {
      setExpandSearchBar(true);
      searchTextBox.current.focus();
    }
  };

  const getSearchSuggestions = async () => {
    if (searchStr.length >= 2) {
      var response = await api.get("/games/search-suggestions", {
        query: searchStr,
        // providers: props.selectedProviders,
        providers: [],
        extensiveInfo: true,
      });
      if (response.status === 200) {
        setSearchSuggestions(response.data);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  useEffect(() => {
    getSearchSuggestions();
  }, [searchStr]);

  const doSearchByGameName = (text) => {
    props.setSearchStr(text);
    toggleExpandedSearchBar(true);
    props.setSelectedProviders([]);
    history.push("/games/search");
  };

  return (
    <>
    <div className="searcbox_area search-container">
      {/* <input
        placeholder={__("Search")}
        value={searchStr}
        onChange={(ev) => setSearchStr(ev.target.value)}
        type="search"
        ref={searchTextBox}
      /> */}
      {/* <div
        onClick={() => toggleExpandedSearchBar(true)}
        className="search"
      ></div> */}

      <Link className="search_btn button">
        <img
          alt=""
          src={require("assets/images/v1/icons/search-icon.svg").default}
        />
      </Link>
      <input
        placeholder={__("Search")}
        value={searchStr}
        onChange={(ev) => setSearchStr(ev.target.value)}
        type="search"
        ref={searchTextBox}
      />
      <Collapse style={{ zIndex: 3050 }} in={!!searchSuggestions.length}>
        <ul className="search_suggestions">
          {searchSuggestions.map((item, index) => (
            <li onClick={() => doSearchByGameName(item.game_name)} key={index}>
              <img
                src={item.game_snapshot_url}
                onError={(event) =>
                  (event.target.parentElement.style.display = "none")
                }
              />
              {item.game_name}
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
    {!!searchSuggestions.length && (
      <div
        className="invisible_overlay"
        onClick={() => {
          setSearchSuggestions([]);
          setSearchStr("");
        }}
      ></div>
    )}
    </>
  );
};

export default SearchBox;
