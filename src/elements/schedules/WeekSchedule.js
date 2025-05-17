import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Toolbar,
  MonthView,
  WeekView,
  ViewSwitcher,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  EditRecurrenceMenu,
  AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";
import { connectProps } from "@devexpress/dx-react-core";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import LocationOn from "@mui/icons-material/LocationOn";
import Notes from "@mui/icons-material/Notes";
import Close from "@mui/icons-material/Close";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Create from "@mui/icons-material/Create";

import { appointments } from "./appoinmentData";

const PREFIX = "Demo";
const classes = {
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  closeButton: `${PREFIX}-closeButton`,
  buttonGroup: `${PREFIX}-buttonGroup`,
  button: `${PREFIX}-button`,
  picker: `${PREFIX}-picker`,
  wrapper: `${PREFIX}-wrapper`,
  icon: `${PREFIX}-icon`,
  textField: `${PREFIX}-textField`,
  addButton: `${PREFIX}-addButton`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`& .${classes.icon}`]: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(2),
  },
  [`& .${classes.header}`]: {
    overflow: "hidden",
    paddingTop: theme.spacing(0.5),
  },
  [`& .${classes.textField}`]: {
    width: "100%",
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  [`& .${classes.closeButton}`]: {
    float: "right",
  },
  [`& .${classes.picker}`]: {
    marginRight: theme.spacing(2),
    "&:last-child": {
      marginRight: 0,
    },
    width: "50%",
  },
  [`& .${classes.wrapper}`]: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1, 0),
  },
  [`& .${classes.buttonGroup}`]: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 2),
  },
  [`& .${classes.button}`]: {
    marginLeft: theme.spacing(2),
  },
}));
const StyledFab = styled(Fab)(({ theme }) => ({
  [`&.${classes.addButton}`]: {
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(4),
  },
}));

const AppointmentFormContainerBasic = ({
  visible,
  visibleChange,
  appointmentData,
  cancelAppointment,
  target,
  onHide,
  commitChanges,
}) => {
  const [appointmentChanges, setAppointmentChanges] = useState({});

  const getAppointmentData = useCallback(
    () => appointmentData,
    [appointmentData]
  );
  const getAppointmentChanges = useCallback(
    () => appointmentChanges,
    [appointmentChanges]
  );

  const changeAppointment = ({ field, changes }) => {
    setAppointmentChanges((prevChanges) => ({
      ...prevChanges,
      [field]: changes,
    }));
  };

  const commitAppointment = (type) => {
    const appointment = {
      ...getAppointmentData(),
      ...getAppointmentChanges(),
    };
    if (type === "deleted") {
      commitChanges({ [type]: appointment.id });
    } else if (type === "changed") {
      commitChanges({ [type]: { [appointment.id]: appointment } });
    } else {
      commitChanges({ [type]: appointment });
    }
    setAppointmentChanges({});
  };

  const displayAppointmentData = {
    ...appointmentData,
    ...appointmentChanges,
  };

  const isNewAppointment = appointmentData.id === undefined;
  const applyChanges = isNewAppointment
    ? () => commitAppointment("added")
    : () => commitAppointment("changed");

  const textEditorProps = (field) => ({
    variant: "outlined",
    onChange: ({ target: change }) =>
      changeAppointment({
        field: [field],
        changes: change.value,
      }),
    value: displayAppointmentData[field] || "",
    label: field[0].toUpperCase() + field.slice(1),
    className: classes.textField,
  });

  const pickerEditorProps = (field) => ({
    value: displayAppointmentData[field],
    onChange: (date) =>
      changeAppointment({
        field: [field],
        changes: date ? date.toDate() : new Date(displayAppointmentData[field]),
      }),
    ampm: false,
    inputFormat: "DD/MM/YYYY HH:mm",
    onError: () => null,
  });

  const startDatePickerProps = pickerEditorProps("startDate");
  const endDatePickerProps = pickerEditorProps("endDate");

  const cancelChanges = () => {
    setAppointmentChanges({});
    visibleChange();
    cancelAppointment();
  };

  return (
    <AppointmentForm.Overlay
      visible={visible}
      target={target}
      fullSize
      onHide={onHide}
    >
      <StyledDiv>
        <div className={classes.header}>
          <IconButton
            className={classes.closeButton}
            onClick={cancelChanges}
            size="large"
          >
            <Close color="action" />
          </IconButton>
        </div>
        <div className={classes.content}>
          <div className={classes.wrapper}>
            <Create className={classes.icon} color="action" />
            <TextField {...textEditorProps("title")} />
          </div>
          <div className={classes.wrapper}>
            <CalendarToday className={classes.icon} color="action" />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="Start Date"
                renderInput={(props) => (
                  <TextField className={classes.picker} {...props} />
                )}
                {...startDatePickerProps}
              />
              <DateTimePicker
                label="End Date"
                renderInput={(props) => (
                  <TextField className={classes.picker} {...props} />
                )}
                {...endDatePickerProps}
              />
            </LocalizationProvider>
          </div>
          <div className={classes.wrapper}>
            <LocationOn className={classes.icon} color="action" />
            <TextField {...textEditorProps("location")} />
          </div>
          <div className={classes.wrapper}>
            <Notes className={classes.icon} color="action" />
            <TextField {...textEditorProps("notes")} multiline rows="6" />
          </div>
        </div>
        <div className={classes.buttonGroup}>
          {!isNewAppointment && (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={() => {
                visibleChange();
                commitAppointment("deleted");
              }}
            >
              Delete
            </Button>
          )}
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => {
              visibleChange();
              applyChanges();
            }}
          >
            {isNewAppointment ? "Create" : "Save"}
          </Button>
        </div>
      </StyledDiv>
    </AppointmentForm.Overlay>
  );
};

const WeekSchedule = () => {
  const [data, setData] = useState(appointments);
  const [currentDate, setCurrentDate] = useState("2018-06-27");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [editingFormVisible, setEditingFormVisible] = useState(false);
  const [deletedAppointmentId, setDeletedAppointmentId] = useState(undefined);
  const [editingAppointment, setEditingAppointment] = useState(undefined);
  const [previousAppointment, setPreviousAppointment] = useState(undefined);
  const [addedAppointment, setAddedAppointment] = useState({});
  const [startDayHour, setStartDayHour] = useState(9);
  const [endDayHour, setEndDayHour] = useState(24);
  const [isNewAppointment, setIsNewAppointment] = useState(false);

  const toggleConfirmationVisible = () => {
    setConfirmationVisible(!confirmationVisible);
  };

  const commitDeletedAppointment = () => {
    setData((prevData) =>
      prevData.filter((appointment) => appointment.id !== deletedAppointmentId)
    );
    toggleConfirmationVisible();
  };

  const toggleEditingFormVisibility = () => {
    setEditingFormVisible(!editingFormVisible);
  };

  const commitChanges = ({ added, changed, deleted }) => {
    setData((prevData) => {
      let updatedData = prevData;
      if (added) {
        const startingAddedId =
          updatedData.length > 0
            ? updatedData[updatedData.length - 1].id + 1
            : 0;
        updatedData = [...updatedData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        updatedData = updatedData.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        setDeletedAppointmentId(deleted);
        toggleConfirmationVisible();
      }
      return updatedData;
    });
    setAddedAppointment({});
  };

  const onEditingAppointmentChange = (appointment) => {
    setEditingAppointment(appointment);
  };

  const onAddedAppointmentChange = (appointment) => {
    setAddedAppointment(appointment);
    if (editingAppointment !== undefined) {
      setPreviousAppointment(editingAppointment);
    }
    setEditingAppointment(undefined);
    setIsNewAppointment(true);
  };

  const appointmentForm = connectProps(AppointmentFormContainerBasic, () => {
    const currentAppointment =
      data.filter(
        (appointment) =>
          editingAppointment && appointment.id === editingAppointment.id
      )[0] || addedAppointment;
    const cancelAppointment = () => {
      if (isNewAppointment) {
        setEditingAppointment(previousAppointment);
        setIsNewAppointment(false);
      }
    };
    return {
      visible: editingFormVisible,
      appointmentData: currentAppointment,
      commitChanges,
      visibleChange: toggleEditingFormVisibility,
      cancelAppointment,
    };
  });

  useEffect(() => {
    appointmentForm.update();
  });

  return (
    <Paper>
      <Scheduler data={data} height={660}>
        <ViewState currentDate={currentDate} />
        <EditingState
          onCommitChanges={commitChanges}
          onEditingAppointmentChange={onEditingAppointmentChange}
          onAddedAppointmentChange={onAddedAppointmentChange}
        />
        <WeekView startDayHour={startDayHour} endDayHour={endDayHour} />
        <MonthView />
        <AllDayPanel />
        <EditRecurrenceMenu />
        <Appointments />
        <AppointmentTooltip showOpenButton showCloseButton showDeleteButton />
        <Toolbar />
        <ViewSwitcher />
        <AppointmentForm
          overlayComponent={appointmentForm}
          visible={editingFormVisible}
          onVisibilityChange={toggleEditingFormVisibility}
        />
        <DragDropProvider />
      </Scheduler>

      <Dialog open={confirmationVisible} onClose={toggleConfirmationVisible}>
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this appointment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={toggleConfirmationVisible}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={commitDeletedAppointment}
            color="secondary"
            variant="outlined"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <StyledFab
        color="secondary"
        className={classes.addButton}
        onClick={() => {
          setEditingFormVisible(true);
          setEditingAppointment(undefined);
          onAddedAppointmentChange({
            startDate: new Date(currentDate).setHours(startDayHour),
            endDate: new Date(currentDate).setHours(startDayHour + 1),
          });
        }}
      >
        <AddIcon />
      </StyledFab>
    </Paper>
  );
};

export default WeekSchedule;
