//-----------------------addEventListener----------------------------------
//function that listen to object
document.addEventListener('DOMContentLoaded',(event)=> {

    getDBAndUpdateSaveList();
    document.getElementById("but_search").addEventListener("click", search);
    document.getElementById("text_input").addEventListener("click", func_input);
});
//----------------------search--------------------------------------------
// the function that triggers an Ajax call
async  function search()
{
    const ulist_repos = document.getElementById("list_repos");
    const ulist_follow = document.getElementById("list_follow");
    const alert_item =   document.getElementById("alert_msg");
    const Text = document.getElementById("text_input").value.trim();//קבלת טקסט
    const inputText = Text.toLowerCase();
    const url_out = 'https://api.github.com/users/' + inputText;
    const username_alert =  document.getElementById("user_name");
    username_alert.innerText = inputText;
    username_alert.style.display = "block";

    //----------------------------------------------------------------------------------------
    if(! await clickOnButtonsIfUserLogin()) // check if user login
        return ;

    fetch(url_out) // JSON of url
        .then(
            function (response) {
                // handle the error - for example pass a bad URL to the loadMenu function
                if (response.status !== 200) {
                    noSuchUser(ulist_repos,ulist_follow,alert_item);
                    return;
                }

                document.getElementById("but_save").addEventListener("click",func_save);
                document.getElementById("but_delete").addEventListener("click",func_delete);
                // response.json() returns a promise that resolves with the result of parsing the body text as JSON.
                // then convert to JSON then Examine the response and generate the HTML
                response.json().then(function (data) //מקבלים אובייקט מהjson
                    {
                        const url_repos = data.repos_url;// get all the repos
                        const myUrl=data.html_url;// the link

                        fetch(url_repos).then(
                            function (response2) {

                                if (response2.status !== 200)
                                {
                                    document.querySelector("menu").innerHTML = 'Looks like there was a problem. Status Code: ' +
                                        response2.status;
                                    return;
                                }

                                ulist_repos.innerHTML = " ";
                                response2.json().then(function (data2)
                                {

                                    if(data2.length ===0)
                                    {
                                        alert_item.innerHTML = '<b> Oops!</b>';
                                        alert_item.innerHTML += 'No repositories ';
                                        alert_item.style.display = "block";
                                    }
                                    buildListReposAndFollowers(data2,ulist_repos,'REPOS');

                                });
                            }
                        )
                        //----------------followers------------------------------
                        const url_follow = data.followers_url;
                        fetch(url_follow).then(
                            function (response3) {

                                if (response3.status !== 200) {
                                    document.querySelector("menu").innerHTML = 'Looks like there was a problem. Status Code: ' +
                                        response3.status;
                                    return;
                                }
                                response3.json().then(function (data3)
                                {
                                    ulist_follow.innerHTML = " ";
                                    if(data3.length===0)
                                    {
                                        alert_item.innerHTML += 'No followers ';
                                        alert_item.style.display = "block";
                                    }

                                    buildListReposAndFollowers(data3,ulist_follow,'FOLLOWERS');
                                });
                            }
                        )
                    }
                )
                    .catch(function (err) {
                        console.log('Fetch Error :', err);
                    });
            });
}


//------------------------------noSuchUser---------------------------------------------
//function that print to screen massage error if no such user
function noSuchUser(ulist_follow,ulist_repos,alert_item)
{
    ulist_follow.innerHTML = " ";
    ulist_repos.innerHTML = " ";
    alert_item.innerHTML = '<b> Oops!</b> '+"No such user";
    alert_item.style.display = "block";
}
//-----------------------------buildListReposAndFollowers-------------------------------
//function that build list repos and followers
function buildListReposAndFollowers(data,list,sign)
{
    for (let i=0; i <data.length;i++)
    {
        const a = document.createElement("a");
        const newItem = document.createElement("li");
        if(sign === 'REPOS')
            a.innerHTML = data[i].name;
        else
            a.innerHTML = data[i].login;
        a.href = data[i].html_url;
        newItem.appendChild(a);
        list.appendChild(newItem);
    }

}
//--------------------------func_save------------------------------------------------
//  async func that save users list
async function func_save()
{
    if(! await clickOnButtonsIfUserLogin())
        return ;

    document.getElementById("alert_msg").style.display="none";
    const inputText = document.getElementById("text_input").value.trim().toLowerCase();

    const obj = { url : 'https://github.com/' + inputText};
    try {
        const res= await fetch(`${ '/api/save'}/${inputText}`,
            {
                method: 'POST',
                body: JSON.stringify(obj), // data can be `string` or {object}!
                headers: {'Content-Type': 'application/json'}
            })
        const json = await res.json();
        console.log(json.key);
        if(json.key === 'false')
        {   document.getElementById("alert_save").style.display = "none";
            const alert_item =   document.getElementById("alert_msg");
            alert_item.innerHTML = '<b> Oops!</b> '+ "User exist";
            alert_item.style.display = "block";
            return ;
        }

    }
    catch (error)
    {
        console.error('Error:', error);
    }

    if (await getDBAndUpdateSaveList())
        await utilsAlert("saved");

}




//----------------------------func_input----------------------------------------
//function that handle on input text and hide the alerts
function func_input()
{
    document.getElementById("but_save").removeEventListener("click",func_save);
    document.getElementById("alert_save").style.display = "none";
    const alert = document.getElementById("alert_msg");
    alert.style.display="none";
    alert.innerHTML = " ";
    document.getElementById("user_name").innerText = " ";
}
//--------------------------func_delete------------------------------------------
//function that delete user from user's list
async function func_delete()
{
    if(! await clickOnButtonsIfUserLogin())
        return ;
    const alert_msg = document.getElementById("alert_msg");
    const alert_save = document.getElementById("alert_save");
    alert_msg.style.display="none";
    const inputText = document.getElementById("text_input").value.trim().toLowerCase();
    try {
        const response = await fetch(`${'/api/delete'}/${inputText}`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });

        console.log("delete");
        const json = await response.json();
        const list_save = document.getElementById("list_save");
        alert_save.style.display="none";
        if(json.key === 'false')
        {
            alert_msg .innerHTML = "User not found";
            alert_msg.style.display = "block";
            return;
        }
    }
    catch (error)
    {
        console.error('Error:', error);
    }

    if (await getDBAndUpdateSaveList())
        await utilsAlert("deleted");
}
//----------------------getDBAndUpdateSaveList-----------------------------------------
//function that get data base from server and update list of screen
async function getDBAndUpdateSaveList()
{
    try {//get all db
        const response2 = await fetch('/api/db');
        const json2 = await response2.json();
        const ulist_save = document.getElementById("list_save");

        console.log(json2.length);
        ulist_save.innerText = " ";
        for (var i = 0; i < json2.length; i++)
        {
            const a = document.createElement("a");
            console.log(json2[i]);
            a.innerHTML = json2[i].name; //name
            a.href = json2[i].url;
            const newItem = document.createElement("li");//crete num
            newItem.appendChild(a);
            ulist_save.appendChild(newItem);
        }
        return true;



    }
    catch (e) {
        return false;

    }
}
//-------------------------utilsAlert----------------------------------------------------
//function that print to screen alert screen
async function utilsAlert(kindButton)
{
    const alert_save = document.getElementById("alert_save");
    alert_save.innerHTML = "User "+kindButton;
    alert_save.style.display = "block";
}
//--------------------clickOnButtonsIfUserLogin-------------------------------------------
//function that return  if user logged , if so- return true,
// else- the page is moved to a login screen and return false
async function clickOnButtonsIfUserLogin()
{
    try {
        const obj = {name:"github"};
        const response_session = await fetch('session',

            { method: 'POST',
                body: JSON.stringify(obj), // data can be `string` or {object}!
                headers: {'Content-Type': 'application/json'}});
        const json = await response_session.json();
        if(json.session === "false")
        {
            location.href = "login";
            return false;
        }
    }
    catch (e) {
        return false;
    }
    return true;

}