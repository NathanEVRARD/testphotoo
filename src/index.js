import {initializeApp} from 'firebase/app'
import {getStorage, ref, uploadBytes, listAll, getDownloadURL} from 'firebase/storage';
import {v4} from 'uuid';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAEUqy_x79KxrgSgbImZ3GIhZrV__SLqEU",
    authDomain: "testphoto-5662c.firebaseapp.com",
    projectId: "testphoto-5662c",
    storageBucket: "testphoto-5662c.appspot.com",
    messagingSenderId: "952712945784",
    appId: "1:952712945784:web:2f8ba41a03b3056f584d8d",
    measurementId: "G-R9X6PX88JQ"
  };

  const app = initializeApp(firebaseConfig)
  export const storage = getStorage(app);
  let imageCounter = 0;
  let htmlImages;
  let imagesListRef = ref(storage, 'images/');
  let imageToUpload;
  const imageContainer = document.querySelector(".images-container");
  const input = document.querySelector("input");
  input.addEventListener("change", (e) => {
    imageToUpload = e.target.files;
    console.log(imageToUpload.length);
  })

  const submitButton = document.querySelector("button");
    submitButton.addEventListener("click", async(e) => {
    if(imageToUpload == null) return;
    imageCounter = 0;
    for(let i = 0; i < imageToUpload.length; i++){
        uploadImage(imageToUpload[i]);
    }
  })
  displayImages();

  function uploadImage(image){
    if(image == null) return;
    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image).then(() => {
        imageCounter++;
    })
  }
  async function prepareImages(){
        let imagesList = [];
        let list = await(listAll(imagesListRef));
        let promises = list.items.map(async (item) => {
            let url = await getDownloadURL(item);
            return url;
        });
        imagesList = await Promise.all(promises);

        return imagesList;
    }
  
  async function displayImages(){
    htmlImages = "";
    let array = await prepareImages();
    console.log(array);
    array.forEach((image) => {
        htmlImages += '<img src="' + image + '">';
        console.log(htmlImages);
    })
    imageContainer.innerHTML = htmlImages;
    console.log("BRUH");
  }
  