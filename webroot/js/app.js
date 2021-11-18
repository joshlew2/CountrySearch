
//headers for our tables
const COUNTRY_HEADERS = ["Full Name", "Alpha Code 2", "Alpha Code 3", "Flag", "Region", "Subregion",
					    "Population", "Languages" ];
const REGION_HEADERS = ["Region", "Count"];
const SUBREGION_HEADERS = ["Subregion", "Count"];


/**
 * Click handler for Submit button 
 */
$(document).ready(function () {
    $("#submit-btn").on("click", function () {
      const nameStr = $("#name-field").val();
      const codeStr = $("#code-field").val();
      $.ajax({
        url: "http://localhost:8765/api/index.php",
        type: "GET",
        dataType: "JSON",
        data: ({ 
        		name: nameStr,
        		code: codeStr 
        	  }),
        success: function (data) {
          if(data.error !== undefined)
          {
          	displayError(data);
          }
          else 
          {
          	displayCountries(data);
          }
        }
      });
    });
})

/**
 *	Display error returned from the server
 */
function displayError(data) {
	
	clearOldData(true);
	const errorDiv = document.getElementById("errors");
	errorDiv.innerHTML = "<h3>Error: " + data.error + "</h3>";
	errorDiv.style.visibility = 'visible';
	return;

}

/**
 * Create and display table of countries returned from the server,
 * along with stats about the data.
 */
function displayCountries(data) {
	
	clearOldData(false);
	const resultsDiv = document.getElementById("results");	
	const tableDiv = document.createElement("table");

	var regionMap = {};
	var subRegionMap = {};

	//add header row
	addHeader(tableDiv,COUNTRY_HEADERS);

	//if only one country, put into array for ease of processing
	if (data.name !== undefined)
	{
		data = [data];
	}

	//Add a row for each country 
	for(let i = 0; i<data.length; i++)
	{

		let rowDiv = tableDiv.insertRow();
		//name
		let nameCell = rowDiv.insertCell();
		nameCell.appendChild(document.createTextNode(data[i].name.official));
		//alpha code 2
		let ac2Cell = rowDiv.insertCell();
		ac2Cell.appendChild(document.createTextNode(data[i].cca2));
		//alpha code 3
		let ac3Cell = rowDiv.insertCell();
		ac3Cell.appendChild(document.createTextNode(data[i].cca3));
		//flag
		let flagCell = rowDiv.insertCell();
		let flagImage = document.createElement('img');
		flagImage.src = data[i].flags.png;
		flagCell.appendChild(flagImage);
		//region
		let regionCell = rowDiv.insertCell();
		let region = data[i].region;
		regionCell.appendChild(document.createTextNode(region));
		//add region count
		if (region in regionMap)
		{
			regionMap[region] +=1;
		}
		else
		{
			regionMap[region] = 1;
		}
		//subregion
		let subRegionCell = rowDiv.insertCell();
		let subregion = data[i].subregion;
		subRegionCell.appendChild(document.createTextNode(subregion));

		//add subregion count
		if (subregion in subRegionMap)
		{
			subRegionMap[subregion] +=1;
		}
		else
		{
			subRegionMap[subregion] = 1;
		}
		//population
		let popCell = rowDiv.insertCell();
		popCell.appendChild(document.createTextNode(data[i].population));
		//languages
		let langCell = rowDiv.insertCell();
		let langList = document.createElement('ul')
		for(let langProp in data[i].languages)
		{
			let bulletEl = document.createElement('li');
			bulletEl.innerHTML = data[i].languages[langProp];
			langList.appendChild(bulletEl);
		}
		langCell.appendChild(langList);

	}
	resultsDiv.appendChild(tableDiv);


	//add summary of data
	let summaryDiv = document.getElementById("summary")
	
	//country count
	let countryCountDiv = document.createElement("div");
	countryCountDiv.innerHTML = "<h4>Total Countries: " + data.length + "</h4>";
	summaryDiv.appendChild(countryCountDiv);

	//region counts
	let regionsTbl = document.createElement("table");
	addHeader(regionsTbl,REGION_HEADERS);
	for(let region in regionMap)
	{
		let rowDiv = regionsTbl.insertRow();
		let regionCell = rowDiv.insertCell();
		regionCell.appendChild(document.createTextNode(region));

		let countCell = rowDiv.insertCell();
		countCell.appendChild(document.createTextNode(regionMap[region]));
	}
	summaryDiv.appendChild(regionsTbl);

	//subregion counts
	let subregionsTbl = document.createElement("table");
	addHeader(subregionsTbl,SUBREGION_HEADERS);
	for(let subregion in subRegionMap)
	{
		let rowDiv = subregionsTbl.insertRow();
		let subregionCell = rowDiv.insertCell();
		subregionCell.appendChild(document.createTextNode(subregion));

		let countCell = rowDiv.insertCell();
		countCell.appendChild(document.createTextNode(subRegionMap[subregion]));
	}
	summaryDiv.appendChild(subregionsTbl);


	resultsDiv.style.visibility = 'visible';
	summaryDiv.style.visibility = 'visible';
	return;
}

/**
 * Add a header row, using the labels passed in
 */
function addHeader(tableDiv,headers)
{
	//add headers
	const headerRow = tableDiv.insertRow();
	for(let i = 0; i<headers.length;i++)
	{
		let headerCell= document.createElement("th");
		let cellText = document.createTextNode(headers[i]);
		headerCell.appendChild(cellText);
		headerRow.appendChild(headerCell);
	}
	return;
}

/**
 * Clear out old HTML when we get new data from the server
 */
function clearOldData(isError)
{
	const resultsDiv = document.getElementById("results");
	const errorDiv = document.getElementById("errors");
	const summaryDiv = document.getElementById("summary");
	resultsDiv.innerHTML = '';
	errorDiv.innerHTML = '';
	summaryDiv.innerHTML = '';
	if (isError)
	{
		resultsDiv.style.visibility = 'hidden';
		summaryDiv.style.visibility = 'hidden';
	}
	else
	{
		errorDiv.style.visibility = 'hidden';
	}
	return;
}