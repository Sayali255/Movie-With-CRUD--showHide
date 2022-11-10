let cl = console.log;
const postContainer= document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const imgUrlControl = document.getElementById("imgUrl");
const ratingControl = document.getElementById("rating");
const btnSubmit = document.getElementById("btnSubmit");
const btnUpdate = document.getElementById("btnUpdate");
const modal = document.getElementById("modal")

let baseUrl = 'http://localhost:3000/posts';

let movieArr = [];

//GET MEthod
const makeApiCall = (methodName,apiUrl,body) => {
    return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(methodName,apiUrl,true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
        xhr.onload = function(){
           if(xhr.status === 200 || xhr.status === 201 && xhr.readyState === 4){
            
                resolve(xhr.response)
           }else{
               reject("ERROR")
           }
        }
        xhr.send(body)
    })
}
makeApiCall("GET",baseUrl)
     .then(res => {
        movieArr = JSON.parse(res);
        cl(movieArr);
        templating(movieArr);
     })
     .catch(cl)

// Templating 

const createPostCard = (obj) => {
    let div = document.createElement("div");
        div.classList.add("col-sm-4");
        div.classList.add("mb-4");
        div.setAttribute("data-id",obj.id);
    let result = `
       
    <div class="card">
        <div class="card-header text-center">
                    <h4>${obj.title}</h4>
         </div>
        <div class="card-body">
                
                            <figure>
                                <img src="${obj.imgPath}" alt="${obj.title}" title="${obj.title}" class="img-fluid">
                            </figure>
                            <figcaption>
                            <span class="rate"> ${obj.Rating}/5</span>
                            <span class="icons">
                                <button onclick="onPostEdit(this)" class="btn btn-success"><i class="fa-solid fa-pen-fancy"></i></button>
                                <button onclick="onPostDelete(this)" class="btn btn-danger"><i class="fa-solid fa-trash-can"></i></button>
                            </span>
                            </figcaption>
         </div>
         </div>
         `

        div.innerHTML = result;
        postContainer.append(div); 
     
}

const templating = (arr) => {
    arr.forEach(ele => {
        createPostCard(ele);
    });
}


//POST Method

const onPostSubmit = (e) => {
    e.preventDefault();
    let obj = {
        title : titleControl.value,
        imgPath : imgUrlControl.value,
        Rating : ratingControl.value
    }
    cl(obj);
    movieArr.push(obj);
    cl(movieArr);
    templating(movieArr);
    makeApiCall("POST", baseUrl, JSON.stringify(obj));
    postForm.reset();
}



// PATCH MEthod


const onPostEdit = (eve) => {
    cl("EDited", eve.closest(".col-sm-4").dataset.id);
    let editId = +eve.closest(".col-sm-4").dataset.id;
    cl(editId);
    let editObj = movieArr.find(obj => obj.id === editId);
    cl(editObj);

    localStorage.setItem("updateObj" ,JSON.stringify(editObj));
    
    titleControl.value = editObj.title;
    imgUrlControl.value = editObj.imgPath;
    ratingControl.value = editObj.Rating;

     btnSubmit.classList.add("d-none");
     btnUpdate.classList.remove("d-none");
    
     
}

const onPostUpdate = (e) => {
    let updateObj = JSON.parse(localStorage.getItem("updateObj"));
    cl(updateObj);
    let obj = {
        title : titleControl.value,
        imgPath : imgUrlControl.value,
        Rating : ratingControl.value,
        id: updateObj.id
    }
    cl(obj)
   

    movieArr.forEach(post => {
        if(post.id == updateObj.id){
            post.title === obj.title;
            post.imgPath === obj.imgPath;
            post.Rating === obj.Rating
        }
    })
    postContainer.innerHTML = '';
    templating(movieArr);
    postForm.reset();

    let updateURl = `${baseUrl}/${updateObj.id}`
    cl(updateURl)

  makeApiCall("PATCH", updateURl,JSON.stringify(obj))

    btnSubmit.classList.remove("d-none");
    btnUpdate.classList.add("d-none");
}


// DELETE

const onPostDelete = (e) => {
    let deleteId = +e.closest(".col-sm-4").dataset.id;
    cl(deleteId);

    let deleteUrl = `${baseUrl}/${deleteId}`;
    cl(deleteUrl);

    let leftOverArray = movieArr.filter(post => post.id !== deleteId);
    cl(leftOverArray);

    makeApiCall("DELETE",deleteUrl);

    postContainer.innerHTML = '';
    templating(leftOverArray)
}

postForm.addEventListener("submit",onPostSubmit)
btnUpdate.addEventListener("click",onPostUpdate)