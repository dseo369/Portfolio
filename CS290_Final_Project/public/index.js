/**************************
 * project: TL;DR
 * file: index.js
 * authors: Andrew Dang, James Carmona, Sam White, Daniel Seo
 * final revision: 12/ /21
**************************/

function createpost(author, newPostTime, newPostText)
{
/*    console.log(newPostText, " at ", newPostTime); // console log test
    document.getElementById("textBar").value = ""; // resetting the text bar
    var newPostHTML = document.createElement("div"); // making a new html div
    newPostHTML.classList.add("post") // adding the "post" class to the new div
    var newPostTextContainer = document.createElement("p") // making a new html p
    newPostTextContainer.classList.add("post-text") // adding the "post text" class to this p
    var newPostTextBody = document.createTextNode(newPostText)// adding a new text node with the body of the input from the text bar
    newPostTextContainer.appendChild(newPostTextBody); // adding the new text node as a child to the p
    var newPostSignature = document.createElement("p") // making a new p
    newPostSignature.classList.add("post-signature") // adding the class post-signature to this p
    var sigstring = ("by " + author + " at " + newPostTime)
    var newPostSignatureBody = document.createTextNode(sigstring); // making a new text node with the body of the current time but I plan to add the author later
    newPostSignature.appendChild(newPostSignatureBody) // appending the text node to the signature p

    newPostHTML.appendChild(newPostTextContainer) // appending the text p to the div
    newPostHTML.appendChild(newPostSignature) // appending the signature p to the div
    var target = document.getElementById("posts"); // finding the target to append to
    target.appendChild(newPostHTML); // appending the complete div to the target

*/
    let post = {
        name: author,
        date: newPostTime,
        postContent: newPostText
    };
    var NewPostHTML = Handlebars.templates.post(post);
    var postsSection = document.getElementById('posts');
    postsSection.insertAdjacentHTML("beforeend", NewPostHTML)
    document.location.replace('/save'+newPostText);
    return post;

}
function getText() {
    var newPostText = document.getElementById("textBar").value; //getting the value from the text bar
    // newPostText = newPostText.slice(0,10);
    return newPostText;
}

function getTime() {
// getting the current date and time
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var newPostTime = date+' '+time;
    return newPostTime;
}


function getauthor()
{
    console.log("click")
    var authorname = document.getElementById("authortextBar").value;
    // authorname = authorname.slice(0,10);
    document.getElementById("authorname").innerText = authorname;
    return authorname;
}

function writePost(posts) {
    console.warn('added', {posts});
    // fs.writeFileSync(path.resolve(__dirname, 'history.json'), JSON.stringify(post));
}

window.onload=function(){   
let posts = [];
var author = "CNG NAME?"
var authorinputbutton = document.getElementById("authorinputButton")
authorinputbutton.addEventListener("click",function() { author = getauthor();})
var inputButton = document.getElementById("inputButton");
inputButton.addEventListener("click", function() {
    var time = getTime();
    var text = getText();
    if (text.length < 1) {
        alert("Please enter up to 10 characters")
        return false;
    }
    let post = createpost(author, time, text);
    posts.push(post)
    writePost(posts);
});
}
