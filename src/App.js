import React from 'react';
import Dropzone from 'react-dropzone';
import translate from 'translate';  
import './App.css';
import * as ml5 from "ml5";
translate.engine = 'google';
translate.key = 'AIzaSyDOzkQB5bI79zKBSiHGH8JRjlI6sM-cBwc';

class App extends React.Component {

  state = {
    imageUrl: undefined,
    classifier: undefined,
    prediction: undefined,
    prediction2 : undefined,
  }

  // Load MobileNet.
  async componentDidMount() {
    const mobileNet = ml5.imageClassifier("MobileNet", () => {
      console.log("Model is loaded");
      this.setState({ classifier: mobileNet });
    });
  }

  // Handle upload file.
  onDrop = (acceptedFiles) => {
    const file = URL.createObjectURL(acceptedFiles[0]);
    this.setState({ imageUrl: file });
  }

  classifyImage = () => {
    const imgTag = document.getElementById("myImage"); // get image tag.
    const { classifier } = this.state;
    classifier.predict(imgTag, (error, results) => { 
      if (error) {
        console.error(error);
      } else {
        translate(results[0].label, { from: 'eng', to: 'vie' }).then(text => {
          this.setState({prediction2 : text ,  prediction: results[0]});
          
        });
      }
    })
  }

  render() {
    return (
      <div className="App mt-5">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h1 className="subtitle has-text-centered">Image</h1>
            <div className="card">
              <div className="card-image">
                {
                  this.state.imageUrl &&
                  < figure className="image is-4by3">
                    <img src={this.state.imageUrl} alt="nothing" id="myImage" />
                  </figure>
                }
              </div>
              <div className="card-content">
                {
                  this.state.prediction &&
                  <div className="content">
                    <p><span className="has-text-weight-bold">Kết quả:</span> {this.state.prediction2}</p>
                    <p><span className="has-text-weight-bold">Chính xác:</span> {(this.state.prediction.confidence / 1 ) * 100} %</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <button className="button is-success is-outlined" onClick={() => this.classifyImage()} disabled={!this.state.imageUrl}>Detect</button>
        
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Nhảy tay ra ...</p> :
                  <p>Hãy kéo tấm hình vào đây để nhận diện hoặc ấn vào trực tiếp vào đây</p>
              }
            </div>
          )}
        </Dropzone>

      </div >
    )
  }
}

export default App;
