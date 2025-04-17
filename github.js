const myForm = document.querySelector(".myForm");
const card = document.querySelector(".card");
const miniCard = document.querySelector(".mini-card");
const userInput = document.querySelector(".user-input");
const apiKey = "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";

myForm.addEventListener("submit", async event =>{
    event.preventDefault();

    try{
        const username = userInput.value.trim();

        if(!username){
            throw new Error("Please enter a Username");        
        }
        const userdata =  await getData(username);
        displayData(userdata);
    }
    catch(error){
        console.error(error);
        displayError(error.message);
    }

    
    
})

async function getData(username) {
    try {
        card.textContent = "Loading...";

    
        const searchResponse = await fetch(`https://api.github.com/search/users?q=${username}`, {
            headers: {
                Authorization: `token ${apiKey}`
            }
        });

        if (!searchResponse.ok) {
            throw new Error("Couldn't find any user with this username!");
        }

        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
            throw new Error("No user found with this username!");
        }

        const userLogin = searchData.items[0].login;
        const userResponse = await fetch(`https://api.github.com/users/${userLogin}`, {
            headers: {
                Authorization: `token ${apiKey}`
            }
        });

        if (!userResponse.ok) {
            throw new Error("Failed to fetch user details!");
        }

        const userDetails = await userResponse.json();
        return userDetails;

    } catch (error) {
        console.error(error.message);
        throw new Error(`${error.message} - Something went wrong while fetching data!`);
    }
}


function displayData(user){

    if(user){

    

    card.style.display = "flex";

    card.textContent = "";
    miniCard.textContent = "";

        const userAvatar = document.createElement("img");
        userAvatar.src = user.avatar_url;
        userAvatar.alt = `${user.login}'s Avatar`;
        
        const userName = document.createElement("p");
        userName.textContent = user.login;

        const userBio = document.createElement("p");
        userBio.textContent = user.bio ? user.bio :"No bio available!";

        const userCompany = document.createElement("p");
        userCompany.textContent = user.company ? user.company : "No company information available!";

        const userFollowers = document.createElement("p");
        userFollowers.textContent = `Followers: ${user.followers}`;

        const userFollowing = document.createElement("p");
        userFollowing.textContent = `Following: ${user.following}`;

        userAvatar.classList.add("profile-pic");
        userName.classList.add("user-name");
        userBio.classList.add("bio");
        userCompany.classList.add("company");
        userFollowers.classList.add("followers");
        userFollowing.classList.add("following");


        card.appendChild(userAvatar);
        card.appendChild(userName);
        card.appendChild(userBio);
        card.appendChild(userCompany);
        card.appendChild(miniCard);

        miniCard.appendChild(userFollowers);
        miniCard.appendChild(userFollowing);
    }

    else{
        displayError("Error: While displaying userdata!");
    }
}





function displayError(message){
    card.textContent="";
    const errorMsg = document.createElement("p");
    errorMsg.textContent = message;
    errorMsg.classList.add("dispError");
    card.appendChild(errorMsg);
}