import React from 'react'
import { CSVLink, CSVDownload } from "react-csv";

class ScrapeRank extends React.Component {
  constructor() {
    super();
    this.state = { rank: [], fileName: 'download' };
    this.showFile = this.showFile.bind(this)
  }

  showFile = async (e) => {
    e.preventDefault()
    let file = e.target.files[0];
    const fileName = `rank-${e.target.files[0].name.split('.')[0]}`
    this.setState({ fileName: fileName })
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const text = reader.result
      const array = text.split(",")
      const rank = []

      const yVals = []
      for (let i = 0; i < array.length; i++) {
        if (array[i].includes('"y"')) {
          yVals.push(array[i].slice(4, array[i].length - 1))
        }
      }

      const eVals = []
      for (let i = 0; i < array.length; i++) {
        if (array[i].includes('"e"')) {
          eVals.push(array[i].split(":")[1])
        }
      }

      const sVals = []
      for (let i = 0; i < array.length; i++) {
        if (array[i].includes('"s"')) {
          sVals.push(array[i].split(":")[1])
        }
      }

      for (let i = 0; i < yVals.length; i++) {
        let result = { 'Y': yVals[i], 'E': eVals[i], 'S': sVals[i] }
        rank.push(result)
      }

      console.log(rank)
      this.setState({ rank: rank })
    };
    reader.onerror = async function () {
      console.log(reader.error);
    };
  }

  render() {
    return (
      <div style={{ marginTop: "1rem" }}>
        <h1 className="title has-text-centered">Scrape Rank</h1>
        <div className="is-flex is-justify-content-center is-align-items-center">
          <input className="button" type="file" onChange={(e) => this.showFile(e)} />
        </div>
        <div style={{ marginTop: "1rem" }} className="is-justify-content-center	is-align-items-center is-flex">
          <CSVLink className="button is-primary" data={this.state.rank} filename={`${this.state.fileName}.csv`}>Export Asins to CSV</CSVLink>
        </div>
      </div >
    )
  }
}

export default ScrapeRank