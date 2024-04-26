const upcomingMovies = [];
let apiOn = false;  // Change this to true ot make api calls

document.addEventListener('DOMContentLoaded', onStart);


function onStart() {
    // api only allows for 500 calls for the free access so while testing 
    // therefor while testing we will use local json files from previous
    // retrievals
    if (apiOn) {  
        // api calls will go here
        apiCallupComingMovies();
    } else {
        fetch("../testJSONFiles/testUpcoming.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error (`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                // console.log(data.data);
                data.data.upcoming.forEach(element => {
                    let x = {
                        movieName:       element.name,
                        releaseDate:    element.releaseDate,
                        imgUrl:         element.posterImage.url
                    }
                    upcomingMovies.push(x);
                });
                createUpcomingMoviesTable();
                return data.data;
            })
            .catch((error) => {
                console.error("Unable to fetch data:", error);
                return null;
            });
        // console.log(upcomingMovies);
    }
    
}

function apiCallupComingMovies() {
    const data = null;

    const xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            let result = JSON.parse(this.responseText); 
            //console.log(result.data.upcoming);
            result.data.upcoming.forEach(element => {
                let x = {
                    movieName:       element.name,
                    releaseDate:    element.releaseDate,
                    imgUrl:         element.posterImage.url
                }
                upcomingMovies.push(x);
            });
            createUpcomingMoviesTable();
        }
    });

    xhr.open('GET', 'https://flixster.p.rapidapi.com/movies/get-upcoming?countryId=usa&limit=20');
    xhr.setRequestHeader('X-RapidAPI-Key', '4de264ce44msh12252737a640dd6p14458ejsnafa490b5ba8d');
    xhr.setRequestHeader('X-RapidAPI-Host', 'flixster.p.rapidapi.com');

    xhr.send(data);
}


function createUpcomingMoviesTable() {
    const table = document.getElementById("upcomingMoviesTable");
    // console.log(table);
    // creating header row
    let headerRow = table.insertRow();
    let hd1 = document.createElement("th");
    hd1.textContent = "Movies";
    hd1.colSpan = 2;
    headerRow.appendChild(hd1);

    let hd2 = document.createElement("th");
    hd2.textContent = "Release Date";
    headerRow.appendChild(hd2);
    table.appendChild(headerRow);
    // creating rows for all of the upcoming movies
    for (let i = 0; i < upcomingMovies.length; i++) {
        let tr = table.insertRow();

        let imgCell = tr.insertCell();
        let imgElm = document.createElement("img");
        imgElm.src = upcomingMovies[i].imgUrl;
        imgElm.alt = `Movie poster for ${upcomingMovies[i].movieName}`;
        // 2:3 ratio
        imgElm.height = "240";
        imgElm.width = "160";
        imgCell.appendChild(imgElm);

        let nameCell = tr.insertCell();
        nameCell.appendChild(document.createTextNode(upcomingMovies[i].movieName));
        
        let dateCell = tr.insertCell();
        dateCell.appendChild(document.createTextNode(upcomingMovies[i].releaseDate !== null ? upcomingMovies[i].releaseDate : 'N/A'));
        
        // console.log(tr);
        table.appendChild(tr);
    }
}

