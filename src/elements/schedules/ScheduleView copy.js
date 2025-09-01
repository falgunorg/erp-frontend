import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import api from "../../services/api";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  EditRecurrenceMenu,
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import ColorLens from "@mui/icons-material/ColorLens";

const PREFIX = "Falgun";
const classes = {
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  flexContainer: `${PREFIX}-flexContainer`,
  viewSelector: `${PREFIX}-viewSelector`,
};

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: "none",
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
  },
  [`& .${classes.viewSelector}`]: {
    marginLeft: "10px",
  },
}));

const FlexibleSpace = ({ selectedSetting, handleSettingChange }) => (
  <StyledToolbarFlexibleSpace className={classes.flexibleSpace}>
    <div className={classes.flexContainer}>
      <ColorLens fontSize="large" htmlColor="#FF7043" />
      <Typography variant="h5" style={{ marginLeft: "10px" }}>
        Falgun Scheduler
      </Typography>
    </div>
    <div className={classes.viewSelector}>
      <TextField
        select
        label="View"
        value={selectedSetting}
        onChange={handleSettingChange}
        variant="outlined"
        fullWidth
        margin="normal"
      >
        {settingsOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  </StyledToolbarFlexibleSpace>
);
const settingsOptions = [
  { label: "Month View", value: "month" },
  { label: "Week View", value: "week" },
  { label: "Day View", value: "day" },
];

const priorities = [
  { id: "high", text: "High", color: "#FF0000" },
  { id: "medium", text: "Medium", color: "#FFA500" },
  { id: "low", text: "Low", color: "#008000" },
];

const priorityColors = {
  high: "#FF0000",
  medium: "#FFA500",
  low: "#008000",
};

const ScheduleView = () => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedSetting, setSelectedSetting] = useState("month");

  const [startDayHour, setStartDayHour] = useState(0);
  const [endDayHour, setEndDayHour] = useState(24);

  const getSchedules = async () => {
    try {
      const response = await api.post("/common/schedules");
      if (response.status === 200 && response.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      try {
        const response = await api.post("/common/schedules-create", added);
        if (response.status === 200 && response.data) {
          await getSchedules();
        }
      } catch (error) {
        console.error("Error creating appointment:", error);
      }
    }

    if (changed) {
      const changedId = Object.keys(changed)[0];
      const updatedAppointment = {
        ...data.find((appt) => appt.id === parseInt(changedId)),
        ...changed[changedId],
      };

      try {
        const response = await api.post(
          "/schedules-update",
          updatedAppointment
        );
        if (response.status === 200 && response.data) {
          await getSchedules();
        }
      } catch (error) {
        console.error("Error updating appointment:", error);
      }
    }

    if (deleted !== undefined) {
      try {
        const response = await api.post("/common/schedules-delete", { id: deleted });
        if (response.status === 200 && response.data) {
          await getSchedules();
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleSettingChange = (event) => {
    setSelectedSetting(event.target.value);
  };

  const renderView = () => {
    switch (selectedSetting) {
      case "month":
        return <MonthView />;
      case "week":
        return <WeekView startDayHour={startDayHour} endDayHour={endDayHour} />;
      case "day":
        return <DayView startDayHour={0} endDayHour={24} />;
      default:
        return <MonthView />;
    }
  };

  const CustomAppointmentForm = ({
    appointmentData,
    onFieldChange,
    ...restProps
  }) => (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <TextField
        label="Priority"
        select
        value={appointmentData.priority || "low"}
        onChange={(event) => onFieldChange({ priority: event.target.value })}
        variant="outlined"
        fullWidth
        margin="normal"
      >
        {priorities.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.text}
          </MenuItem>
        ))}
      </TextField>
    </AppointmentForm.BasicLayout>
  );

  const CustomAppointment = ({ children, style, data, ...restProps }) => {
    const priorityColor = priorityColors[data.priority] || "#64b5f6";
    return (
      <Appointments.Appointment
        {...restProps}
        data={data}
        style={{ ...style, backgroundColor: priorityColor }}
      >
        {children}
      </Appointments.Appointment>
    );
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <>
      <Scheduler data={data}>
        <EditingState onCommitChanges={commitChanges} />
        <ViewState defaultCurrentDate={new Date()} />
        {renderView()}
        <Appointments appointmentComponent={CustomAppointment} />
        <Toolbar
          flexibleSpaceComponent={() => (
            <FlexibleSpace
              selectedSetting={selectedSetting}
              handleSettingChange={handleSettingChange}
            />
          )}
        />
        <DateNavigator />
        <EditRecurrenceMenu />
        <AppointmentTooltip showCloseButton showDeleteButton showOpenButton />
        <AppointmentForm basicLayoutComponent={CustomAppointmentForm} />
        <DragDropProvider />
      </Scheduler>
    </>
  );
};

export default ScheduleView;
