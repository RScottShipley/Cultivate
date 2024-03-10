import './App.css';
import React from 'react';
import {useState, useEffect} from 'react';

const App = () => {
  const [allData, setAllData] = useState([{}]);
  const [brands, setBrands] = useState([{}]);
  const [favorites, setFavorites] = useState([{}]);
  
  const callAPI = async () => {
    const response = await fetch("http://localhost:9000/cultivateAPI");
    if (response.ok) {
      const newData = await response.json();
      const newBrands = newData.values;
      createBrands(newBrands);
    } else {
      console.log("Info was not fetched properly.")
    }
  }

  // values = [{name: '', bio: '', id: '', pictures: '', price: '', terms: ''}]
  const createBrands = (values) => {
    let tempValues = values;
    let properties = tempValues[0];
    tempValues.shift();
    //create brands
    let newBrands = [];
    for (let i = 0; i < tempValues.length; i++) {
      let brand = {};
      for (let j = 0; j < properties.length; j++) {
        if (properties[j] === 'tags' && !tempValues[i][j]) {
          brand[properties[j]] = '';
        } else if (properties[j] === 'homepage' && !tempValues[i][j]) {
          brand[properties[j]] = 'https://www.facebook.com/';
        } else if (properties[j] === 'tags') {
          brand[properties[j]] = tempValues[i][j].trim();
        } else {
          brand[properties[j]] = tempValues[i][j];
        }
      }
      newBrands.push(brand);
    }
    setAllData(newBrands);
    setBrands(newBrands);
    console.log(newBrands);
  }

  function filterByPrice(price) {
    let brandsToFilter = allData;
    let filteredBrands = brandsToFilter.filter(brand => brand.price === price);
    setBrands(filteredBrands);
  }
  
  //search for brands using an array of terms
  function searchByTerm(termBank) {
    //Right now multiple copies of the same brand can show up
    //possible fix: fix array to set or filter out duplicates by ID in map
    let brandsToSearch = allData;
    let searchedBrands = brandsToSearch.filter(brand => {
      let term = brand.tags;
      return term.indexOf(termBank) !== -1;
    })
    if (searchedBrands) {
      setBrands(searchedBrands);
    } else {
      setBrands(allData);
    }
  }

  function addFavorite(brandID) {
    let currentFavorites = favorites;
    let brandToAdd = allData.find(posBrand => posBrand.ID === brandID);
    currentFavorites.push(brandToAdd);
    console.log("Added brand to favorites: " + brandID);
    setFavorites(currentFavorites);
  }

  function removeFavorite(brandID) {
    let currentFavorites = favorites.filter(checkBrand => checkBrand.ID !== brandID);
    console.log("Removed brand from favorites: " + brandID);
    setFavorites(currentFavorites);
  }

  useEffect(() => {
    callAPI();
  }, [])

  return (
    <div className='App'>
      <div className='App-Title'>
        <h1>Cultivate</h1>
      </div>
      <div className='App-Search-Filter'>
        <div className='App-Filter'>
          <Filter filter={filterByPrice} />
        </div>
        <div className='App-SearchBar'>
          <SearchBar search={searchByTerm} />
        </div>
      </div>
      <div className='App-BrandList'>
        <BrandList brands={brands} 
        addFavorite={addFavorite}
        removeFavorite={removeFavorite} />
      </div>
    </div>
  )
}

const SearchBar = (props) => {
  const [searchTerm, setSearchTerm] = useState([]);

  function handleChange(event) {
    let searchingTerm = event.target.value;
    setSearchTerm(searchingTerm);
  }

  function handleSubmit() {
    props.search(searchTerm);
  }

  return (
    <div className='SearchBar'>
      <input 
      placeholder='Search for brands by term' 
      onChange={handleChange}
      onSubmit={handleSubmit} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
};

const Filter = (props) => {

  function handleFilter(event) {
    console.log(event.target.innerHTML);
    switch (event.target.innerHTML) {
      case '$':
        props.filter('$');
        break;
      case '$$':
        props.filter('$$');
        break;
      case '$$$':
        props.filter('$$$');
        break;
      case '$$$$':
        props.filter('$$$$');
        break;
      default:
        break;
    }
  }

  return (
    <div className='Filter'>
      <button onClick={dropDownMenu} className='Filter-Dropdown'>=</button>
      <div id="myDropdown" className='Filter-Content'>
        <p onClick={handleFilter}>$</p>
        <p onClick={handleFilter}>$$</p>
        <p onClick={handleFilter}>$$$</p>
        <p onClick={handleFilter}>$$$$</p>
      </div>
    </div>
  )
};

const dropDownMenu = () => {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.Filter-Dropdown')) {
    let dropdowns = document.getElementsByClassName('Filter-Content');
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

const BrandList = (props) => {
  return (
    <div className='BrandList'>
      <div className='BrandList-container'>
        {props.brands.map(brand => {
          return <Brand brand={brand} 
          key={brand.ID} 
          addFavorite={props.addFavorite} 
          removeFavorite={props.removeFavorite}
           />;
        })}
      </div>
    </div>
  )
};

const Brand = (props) => {
  return (
    <div className='Brand'>
      <div className='Brand-BrandTitle'>
        <BrandTitle 
        name={props.brand.name} 
        addFavorite={props.addFavorite}
        removeFavorite={props.removeFavorite} 
        id={props.brand.ID} 
        homepage={props.brand.homepage}/>
      </div>
      <div className='Brand-PictureList'>
        <PictureList pictures={props.brand.pictures} 
        brand={props.brand} />
      </div>
    </div>
  )

  // <div className='Brand-BrandBio'>
  //       <BrandBio bio={props.brand.bio} />
  //     </div>
};

const BrandBio = (props) => {
  return (
    <div className='BrandBio'>
      <p>{props.bio}</p>
    </div>
  )
};

const BrandTitle = (props) => {
  return (
    <div className='BrandTitle'>
      <div className='BrandTitle-Name'>
        <a href={props.homepage} target="_blank"><h2>{props.name}</h2></a>
      </div>
      <div className='BrandTitle-Favorite'>
        <Favorite addFavorite={props.addFavorite}
        removeFavorite={props.removeFavorite} 
        id={props.id}/>
      </div>
    </div>
  )
};

const Favorite = (props) => {
  function favoriteCheck(event) {
    if (event.target.checked) {
      //checkbox is checked === add to favorites
      props.addFavorite(props.id);
    } else {
      //checkbox is not checked === remove from favorites
      props.removeFavorite(props.id)
    }
  }

  return (
    <div className='Favorite'>
      <input onChange={favoriteCheck} type="checkbox" id="heart"/>
      <label for="heart"></label>
    </div>
  )
}

const PictureList = (props) => {
  const [pictures, setPictures] = useState([]);

  const establishPicture = () => {
    let picturesTemp = props.pictures;
    let picturesArray = [];
    if (picturesTemp) {
      picturesArray = picturesTemp.split(";").map(pic => pic.trim());
    }
    setPictures(picturesArray);
  }

  useEffect(() => {
    establishPicture();
  }, []);

  return (
    <div className='PictureList'>
      <div className='PictureList-container'>
        {pictures.map(picture => {
          return <Picture src={picture} homepage={props.brand.homepage}/>
        })}
      </div>
    </div>
  )
};

const Picture = (props) => {
  return (
    <div className='Picture'>
      <a href={props.homepage} target="_blank"><img src={props.src}/></a>
    </div>
  )
};

export default App;
