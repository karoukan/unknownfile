import React from "react";
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

function ShowDownloadableLink(props) {
    const linkGenerated = props.linkGenerated;
    function handleCopy() {
        navigator.clipboard.writeText("http://localhost/"+linkGenerated)
        toast.success(`Copié dans le presse papier !`)
    }
    return (
        <div>
            {
               linkGenerated != null &&
               <p>
                <div className="row">
                    <div className="col-md-12">
                        <h4><FontAwesomeIcon icon={faCheckCircle} /> Partagez votre fichier !</h4>
                        <div className="col-md-12">
                            <FontAwesomeIcon icon={faDownload} />&nbsp;&nbsp;&nbsp;<a href={"http://localhost/"+linkGenerated}>{linkGenerated}</a><button className="btn" onClick={handleCopy}><FontAwesomeIcon icon={faCopy} /></button>
                        </div>
                    </div>
                </div>
               </p>
            }
        </div>
    )
}

function ShowProgressBar(props) {
    const fileReadyToUpload = props.fileReadyToUpload;
    return (
        <div>
            {
                fileReadyToUpload != null && 
                <p>
                    Progression de votre upload : {fileReadyToUpload}
                </p>
            }
        </div>
    )
}


class DragDropZone extends React.Component {
    constructor(props) {
        super(props);
        this.handleFile = this.handleFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);

        this.state = { 
            selectedFile: null,
	    newLinkGenerated: null,
            isLoading: false
        };
    }

    handleFile(event) {
        this.setState({
            selectedFile: event.target.files[0],
            selectedFileName: event.target.files[0].name,
            isLoading: true,
            loaded: 0,
        })
        /*
	TODO : Limiter la taille des transferts max
	*/
        console.log(event.target.files[0]);
    }

    uploadFile() {
        const data = new FormData()

        data.append('fileNeedUpload', this.state.selectedFile)
        if (this.state.selectedFile != null) {
            const url = 'https://localhost:8000/upload';
            axios.post(url, data, {
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                    })
                },
            }).then(res => { 
                let fileUrl = res.data

                this.setState({ newLinkGenerated: fileUrl })
                //console.log(this.state.newLinkGenerated);

                toast.success('Votre fichier est prêt !')
            }).catch(err => { 
                toast.error('Une erreur s\'est produite lors du transfert !')
            })
        } else {
            toast.error('Merci de sélectionner un fichier !')
        }
    }

    render() {
        return (
            <div className="DragDropZone">
                    <div>
                        <ToastContainer />
                    </div>
                    <div className="container py-5">
                        <div className="row py-4">  

                            <div className="col-lg-6 mx-auto">      
                                    <h2 className="mb-4">Unknown File</h2>
                                    <p className="mb-4">Unknown File est un service de transfert de fichier.<br />Tous types de fichiers supportés (fichiers, images, musiques, videos, pdf etc...).<br />
                                    <br />Commencez par choisir un fichier à partager. </p>         
                            </div>  

                            <img src="https://res.cloudinary.com/mhmd/image/upload/v1564991372/image_pxlho1.svg" alt="" height="150" width="150" className="mb-4" />
        
                            <div className="col-lg-6 mx-auto">
                                <div className="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
                                        <input id="upload" name="fileNeedUpload" type="file" onChange={this.handleFile} className="inputUpload form-control border-0" />
                                        <label id="upload-label" htmlFor="upload" className="uploadLabel font-weight-bold text-secondary"></label>
                                        <div className="input-group-append">
                                                <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"> <i className="fa fa-cloud-upload mr-2 text-muted"></i><small className="text-uppercase font-weight-bold text-muted">Choisir un fichier</small></label>
                                        </div>
                                </div>
                                
                                <ShowProgressBar fileReadyToUpload={this.state.selectedFileName} />
                                {this.state.isLoading && <Progress className="progressUpload" max="100" color="success" value={this.state.loaded}> {Math.round(this.state.loaded,2) }% </Progress>
                                }
                                <div className="form-group">
                                    <button disabled={!this.state.selectedFile} className="btnUpload" type="button" onClick={this.uploadFile}>Partager</button>
                                </div>

                                <ShowDownloadableLink linkGenerated={this.state.newLinkGenerated} />

                            </div>
                        </div>
                    </div>
          </div>
        );
    }
}


function App() {
    return (
        <DragDropZone />
    );
}

export default App;
  
