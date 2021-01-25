import React from "react";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import { makeStyles, Typography } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyle = makeStyles((theme) => ({
  dropLayerStyle: {
    width: "100%",
    height: "100%",
    borderRadius: "5px",
    border: "4px dashed currentColor",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    overflow: "hidden",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
  },
  textStyle: {
    width: "100%",
    fontSize: "20px",
    opacity: "0.75",
  },
  iconStyle: {
    fontSize: "75px",
  },
}));

export default function DropLayer(props) {
  const { onDrop, onClickLabel, acceptType } = props;
  const classes = useStyle();
  const [{ isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item, monitor) => {
      if (onDrop) {
        onDrop(props, monitor);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  function handleManualChoose(ev) {
    if (ev.target.files.length === 0) {
      return;
    }
    let file = ev.target.files[0];
    onClickLabel && onClickLabel(file);
  }

  function renderText(isActive) {
    if (isActive) {
      return <span>{"Release to drop file"}</span>;
    }
    return (
      <span>
        <span>Drag and drop or </span>
        <label htmlFor={"fileChoose"}>
          <input
            type="file"
            accept={acceptType
              .map((t) => {
                return `.${t}`;
              })
              .join(",")}
            id="fileChoose"
            name="fileChoose"
            onChange={handleManualChoose}
            style={{
              position: "absolute",
              left: "-100px",
              top: "-100px",
              zIndex: -1,
              display: "none",
            }}
          />
          <span style={{ color: "#4b87ff", cursor: "pointer" }}>
            Click To Upload
          </span>
        </label>
      </span>
    );
  }

  return (
    <div
      ref={drop}
      className={classes.dropLayerStyle}
      style={{
        backgroundColor: isOver ? "rgba(104,171,230,0.5)" : "",
        borderColor: isOver ? "rgba(104,171,230,1)" : "rgba(0,0,0,0.75)",
      }}
    >
      <Typography component={"div"} className={classes.textStyle}>
        <div>
          <CloudUploadIcon className={classes.iconStyle} />
        </div>
        <div>{renderText(isOver)}</div>
      </Typography>
    </div>
  );
}
