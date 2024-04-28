const theaters = [];
let apiOnShowtimes = true;  // Change this to true to make API calls

document.addEventListener('DOMContentLoaded', onStart);


function onStart() {
    // api only allows for 500 calls for the free access so while testing 
    // therefor while testing we will use local json files from previous
    // retreavals
    if (apiOnShowtimes) {  
        // min miles is 3
        // 8 miles gets 7 theaters
        const radius = 5;  // Miles, please don't make this larger than 15 will cause too many API calls
        const zipCode = 85701  // zip code for downtown tucson
        const data = null;
        const xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                // console.log(this.responseText);
                let result = JSON.parse(this.responseText);
                result.data.theaters.forEach(theaterInfo => {
                    theaters.push({theaterID: theaterInfo.id ,theaterName: theaterInfo.name, movies: []});
                });
            }
            itterateTheaters();
        });

        xhr.open('GET', `https://flixster.p.rapidapi.com/theaters/list?zipCode=${zipCode}&radius=${radius}`);
        xhr.setRequestHeader('X-RapidAPI-Key', '2903ae3fb4msh3036339dc4d02c8p1e3696jsnd0b14dc98bbc');
        xhr.setRequestHeader('X-RapidAPI-Host', 'flixster.p.rapidapi.com');

        xhr.send(data);
    } else {
        fetch("../testJSONFiles/testTheaterDetail.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error (`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                // console.log(data.data);
                theaters.push({theaterName: "Cinemark Century Tucson Marketplace and XD", movies: []});
                data.data.theaterShowtimeGroupings.movies.forEach(element => {
                    let movieInfo = {
                        movieName:      element.name,
                        releaseDate:    element.releaseDate,
                        imgUrl:         element.posterImage.url,
                        tomatoRating:   element.tomatoRating,
                        userRating:     element.userRating,
                        runtime:        element.durationMinutes,
                        movieRating:    element.motionPictureRating.code,
                        showtimes:      element.movieVariants[0].amenityGroups[0].showtimes
                    };
                    theaters[0].movies.push(movieInfo);
                    // theaters.push({theaterName: "Cinemark Century Tucson Marketplace and XD", movies: movieInfo});
                });
                theaters.forEach(createShowtimesTable);
                theaters.forEach(createShowtimesTable);
                return data.data;
            })
            .catch((error) => {
                console.error("Unable to fetch data:", error);
                return null;
            });
        // console.log(upcomingMovies);
    }
    
}

/**
 * Made function to place delay between each API call since there is a
 * limit of 5 calls per second.
 */
function itterateTheaters() {
    let index = 0;

    function next() {
        if (index < theaters.length) {
            makeAPICall(theaters[index]);
            index ++;

            if (index < theaters.length) {
                setTimeout(next, 200)
            }
        }
    }
    
    next();
    // console.log(theaters);
}

function makeAPICall(theater) {
    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            // console.log(this.responseText);
            let result = JSON.parse(this.responseText);
            // console.log(innerResult);
            result.data.theaterShowtimeGroupings.movies.forEach(element => {
                let movieInfo = {
                    movieName:      element.name,
                    releaseDate:    element.releaseDate,
                    imgUrl:         element.posterImage.url,
                    tomatoRating:   element.tomatoRating,
                    userRating:     element.userRating,
                    runtime:        element.durationMinutes,
                    movieRating:    element.motionPictureRating ? element.motionPictureRating.code : null,
                    showtimes:      element.movieVariants[0].amenityGroups[0].showtimes
                };
                theater.movies.push(movieInfo);
            });
            createShowtimesTable(theater);
        }
    });
    xhr.open('GET', `https://flixster.p.rapidapi.com/theaters/detail?id=${theater.theaterID}`);
    xhr.setRequestHeader('X-RapidAPI-Key', '2903ae3fb4msh3036339dc4d02c8p1e3696jsnd0b14dc98bbc');
    xhr.setRequestHeader('X-RapidAPI-Host', 'flixster.p.rapidapi.com');
    xhr.send(data);
}


function createShowtimesTable(theater) {
    // const table = document.getElementById("showtimesMoviesTable");
    const container = document.getElementById("showtimesTableContainer");
    const table = document.createElement("table");
    table.classList.add(`${theater.theaterName.replace(/ /g, "-")}Table`, "showtimesMoviesTable")
    // console.log(table);
    // Adding theater name header
    let headerRow = table.insertRow();
    let hd1 = document.createElement("th");
    hd1.textContent = theater.theaterName;
    hd1.colSpan = 3;
    headerRow.appendChild(hd1);
    table.appendChild(headerRow);
    // Will now add the poster cell, movieInfo cell, and showtimes cell
    theater.movies.forEach(movieInfo => {
        let tr = table.insertRow();
        // Inserting image
        let imgCell = tr.insertCell();
        let imgElm = document.createElement("img");
        imgElm.src = movieInfo.imgUrl;
        imgElm.alt = `Movie poster for ${movieInfo.movieName}`;
        // 2:3 ratio
        imgElm.width = "180";
        imgElm.height = "270";
        imgCell.appendChild(imgElm);
        //Inserting movie info
        let infoCell = tr.insertCell();
        let infoCellList = document.createElement("ul");
        infoCellList.classList.add("noBullet")
        // release date
        let infoCellElm = [document.createElement("li"), document.createElement("li"), 
            document.createElement("li"), document.createElement("li"), document.createElement("li")];
        infoCellElm[0].innerHTML = `<strong> Release Date:</strong>\t${movieInfo.releaseDate}`;
        // Rotten tomato score
        if (movieInfo.tomatoRating) {  // Sometimes tomato Score does not exist
            let tomatoImg = document.createElement("img");
            tomatoImg.src = movieInfo.tomatoRating.iconImage.url;
            tomatoImg.alt = `Rotten tomato image relfecting a score of ${movieInfo.tomatoRating.tomatometer}%`;
            tomatoImg.height = 25;
            tomatoImg.width = 25;
            infoCellElm[3].innerHTML = `<strong>Tomato Score:</strong>\t${movieInfo.tomatoRating.tomatometer}%\t`;
            //infoCellElm[1].appendChild(document.createTextNode(`Tomato Score:\t${movieInfo.tomatoRating.tomatometer}%\t`));
            infoCellElm[3].appendChild(tomatoImg);
        }
        // sometimes user rating does not exist
        if (movieInfo.userRating && movieInfo.userRating.dtlLikedScore !== null) {
            let tomatoImg = document.createElement("img");
            tomatoImg.src = movieInfo.userRating.iconImage.url;
            tomatoImg.alt = `User rating popcorn image reflecting a score of ${movieInfo.userRating.dtlLikedScore}%`;
            tomatoImg.height = 25;
            tomatoImg.width = 25;
            infoCellElm[4].innerHTML = `<strong>User Score:</strong>\t${movieInfo.userRating.dtlLikedScore}%\t`;
            //infoCellElm[1].appendChild(document.createTextNode(`Tomato Score:\t${movieInfo.tomatoRating.tomatometer}%\t`));
            infoCellElm[4].appendChild(tomatoImg);
        }
        // creating runtime text
        infoCellElm[1].innerHTML = `<strong>Runtime:</strong>\t${minutesToHoursMinutes(movieInfo.runtime)}`;
        // Creating rating text
        infoCellElm[2].innerHTML = `<strong>Rating:</strong>\t${movieInfo.movieRating ? movieInfo.movieRating : "N/A"}`;
        infoCellElm.forEach(cell => {
            // Does not display tomato score if there is not one available
            if (cell.childNodes.length > 0) { 
                infoCellList.appendChild(cell);
            }
        })
        let movieNameNode = document.createElement("div");
        movieNameNode.classList.add("movieName");
        movieNameNode.textContent = movieInfo.movieName;
        let showTimesNode = document.createElement("ul");
        showTimesNode.classList.add("showtimes")
        movieInfo.showtimes.forEach(show => {
            let elem = document.createElement("li");
            elem.textContent = convertToAMPM(show.providerTime);
            showTimesNode.appendChild(elem);
        });
        infoCell.appendChild(movieNameNode);
        infoCell.appendChild(infoCellList);
        let showTimesCell = tr.insertCell();
        let showTimeLabel = document.createElement("div");
        showTimeLabel.classList.add("showtimeLabel")
        showTimeLabel.textContent = "Showtimes:";
        showTimesCell.appendChild(showTimeLabel);
        showTimesCell.appendChild(showTimesNode);
        container.appendChild(table);
        // console.log(movieInfo.showtimes);
    });
}

function convertToAMPM(timeString) {
    let parts = timeString.split(":");
    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);
    // Determine AM or PM
    let ampm = hours >= 12 ? "PM" : "AM";
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (00:00) as 12 AM

    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    
    return hours + ":" + formattedMinutes + " " + ampm;
}

function minutesToHoursMinutes(minutes) {
    if (minutes == null) {
        return "0 minutes";
    }
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    let hoursStr = hours > 0 ? hours + " hour" + (hours !== 1 ? "s" : "") : "";
    let minutesStr = remainingMinutes > 0 ? remainingMinutes + " minute" + (remainingMinutes !== 1 ? "s" : "") : "";

    // Combine hours and minutes strings
    let result = [hoursStr, minutesStr].filter(Boolean).join(" ");

    return result || "0 minutes"; // Return '0 minutes' if input is 0
}

