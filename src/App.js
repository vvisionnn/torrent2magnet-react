import React from "react";
import "./App.css";
const parseTorrent = require("parse-torrent");

function App() {
  const [magnetList, setMagnetList] = React.useState([]);

  const handleFileChosen = async (event) => {
    const files = event.target.files;

    const readFileAsync = (file) =>
      new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = function () {
          var arrayBuffer = reader.result;
          const bf = Buffer.from(arrayBuffer);
          const torrentFile = parseTorrent(bf);
          const magnetLink = `magnet:?xt=urn:btih:${torrentFile.infoHash}&dn=${torrentFile.name}`;
          resolve(magnetLink);
        };
        reader.readAsArrayBuffer(file);
      });

    let tempList = [];
    for (let i = 0; i < files.length; i++) {
      tempList.push(await readFileAsync(files[i]));
    }
    setMagnetList(tempList);
  };

  return (
    <>
      <input
        type="file"
        accept=".torrent"
        onChange={handleFileChosen}
        multiple
      />
      {magnetList.length > 0 && (
        <ul>
          {magnetList.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      )}
    </>
  );
}

export default App;
