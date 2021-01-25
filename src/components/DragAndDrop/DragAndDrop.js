import React, { useCallback } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import DropLayer from "./DropLayer";

const useStyles = makeStyles((theme) => ({
  box: {
    width: "100%",
    height: "100%",
  },
}));

export default function DND(props) {
  const { onDrop, acceptType } = props;
  const classes = useStyles();
  const handleFileDrop = useCallback(
    (item, monitor) => {
      if (monitor && onDrop) {
        const files = monitor.getItem().files;
        let containUnsupportedFile = false;
        files.forEach((file) => {
          const type = String(file.name.split(".").pop()).toLowerCase();
          console.log(acceptType.indexOf(type), acceptType, type);
          if (acceptType.indexOf(type) === -1) {
            containUnsupportedFile = true;
          }
        });
        !containUnsupportedFile
          ? onDrop(files)
          : window.alert("contains unsupported file, please try again.");
      }
    },
    [onDrop, acceptType]
  );

  function handleLabelClicked(file) {
    if (file) {
      onDrop([file]);
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box className={classes.box}>
        <DropLayer
          onDrop={handleFileDrop}
          onClickLabel={handleLabelClicked}
          acceptType={acceptType}
        />
      </Box>
    </DndProvider>
  );
}
