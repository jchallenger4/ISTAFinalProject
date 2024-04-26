I've (Mike) added a working homepage, with a dark mode toggle for our javascript. I would leave the homepage alone as it is pretty much complete other than if you need to update a filename. Each of the pages should have pretty much the same header and head. This will keep the banner and favicon consistent. I also added a new stylesheet, styles2.css. 

  Try not to break anything. I'd recommend just adding styles to the bottom of the page because multiple sheets may get a little tricky. 

  Keep the file types separated by their respective folders. Linking is easy. If you are in an html file and want to link and image, you just link the relative path to the image. ../images/example.jpg 

**API use**:
  - Currently, the coming soon page can use an API but is not actively using it. The API functionality does work but the service I found only allows for 500 calls for the free service. So, I added temporary data in the JSON files that is the same as what the API call would return. If you want to use the API there is a variable that can be set to true in genComingSoon.js to enable it, but please don't overuse it. Worst case scenario I can just make another account though so it's not the end of the world.
  - API being used is [Flixster](https://rapidapi.com/apidojo/api/flixster/details)
  - Did find out that the only way that the only way that the page loads with the local JSON data is if you run or simulate a local server otherwise you run into a CORS error that doesn't allow the js script to read a file. I was doing this unknowingly by using a VSCode extension that allows me to preview html pages. The extension I am using is called **Live Preview**. When the API calling is on the webpage is unaffected.

**Done**:
- One e-mail hyperlink
- Consistent banner logo area
- Consistent main navigation
- Multimedia Element: YouTube video, CSS image gallery, or CSS Transition
- One page containing a form with at least three elements
- Use of JavaScript on two pages
- 
**Todo**:
- Appropriate meta tags
- One page utilizing tables effectively to display tabular information (making sure the data being shared is clearly explained): probably best for the showtimes page
- Consistent banner logo area (keep banner consistent)
- W3C Validation and accessibility standards
