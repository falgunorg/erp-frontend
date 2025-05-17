import React, { useEffect } from "react";
import ScheduleView from "../../elements/schedules/ScheduleView";

export default function Schedules(props) {
  useEffect(async () => {
    props.setHeaderData({
      pageName: "Scheduler",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);
  return <ScheduleView />;
}
