const fs = require('fs');

function fromJSONFile(filename) {
  return (req, res) => {
    const data = fs.readFileSync(`mock/${filename}.json`).toString();
    const json = JSON.parse(data);
    return res.json(json);
  };
}
const proxy = {
  'POST /title/api/list': fromJSONFile('list'),
};
module.exports = proxy;
