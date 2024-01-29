import './App.css'
import { useEffect, useRef, useState } from 'react'
import GroupsSec from './components/groups-comp/GroupsSec';
import ListOfNotes from './components/notesListing/ListOfNotes';
import closeIcon from './images/icons8-close.svg';

//function to generate random color 
function randomColorGenerator() {
  const randomColor = (`#${Math.floor(Math.random() * 0xffffff).toString(16)}`)
  return randomColor
}





function App() {

  let defaultColorOptions = {
    '#B38BFA': false,
    '#FF79F2': false,
    '#43E6FC': false,
    '#F19576': false,
    '#0047FF': false,
    '#6691FF': false,
  };
  let [pickColor, setPickColors] = useState(defaultColorOptions);

  //function to update the random generated color and append it to default Color options OBJECT
  function updateColor() {
    defaultColorOptions[randomColorGenerator()] = false;
    console.log("Color Updated!!!");
  }

  updateColor()
  updateColor()


  //Screen-Setter
  const [isBigScreen, setBigScreen] = useState(window.innerWidth > 700);
  const updateScreenSize = () => {
    setBigScreen(window.innerWidth > 700)
  }
  useEffect(() => {
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize)
  })

  //this state is responsible for tracking which group is currently selected by user 
  let [selectedGroup, setSelectedGroup] = useState(null);

  //this state is responsible for displaying the create new group form 
  let [openGroupPopUP, setOpenGroupPopUp] = useState(false)

  
  let [groups, setGroups] = useState([]);


  // useRef hook is used to track the name of group which user entered
  let nameReference = useRef("")



  let everyGroup = JSON.parse(localStorage.getItem('groups'));
  if (everyGroup == undefined) {
    everyGroup = [];
  }

  //generates new id with the help of string co-catenation  
  function anotherGroupUniqueId(key) {
    let count = everyGroup.length + 1;
    return function () {
      return key + count++;
    }
  }
  let makeIdOfNewGroup = anotherGroupUniqueId('grp');


  let colorPicked = "";
  //this function is responsible for validating user inputs + pushing the group details entered by user 
  const addGroupList = () => {
    colorPicked = Object.keys(pickColor).find(key => pickColor[key] === true);
    if (nameReference.current.value.trim() == "") {
      alert("Please enter the group name!")
      return;
    }
    if (colorPicked == undefined) {
      alert("Please pick a color!")
      return;
    }

    everyGroup.push(
      {
        id: makeIdOfNewGroup(),
        name: nameReference.current.value,
        color: colorPicked
      }
    )
    setPickColors(defaultColorOptions);
    setOpenGroupPopUp(false);

    //store the key value pairs  of everygroup array in browser's local storage
    localStorage.setItem('groups', JSON.stringify(everyGroup));

  }




  return (
    <>
      {
        /*1st conditional rendering
        if big screen is true renders Group section(left-side) and Notes List(right-side) (enough screen size to display both)*/
        isBigScreen ?
          <>
            <div className='groupSecDiv'>
              <GroupsSec setOpenGroupPopUp={setOpenGroupPopUp} setGroups={setGroups} everyGroup={everyGroup} setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
            </div>

            <div className='notesListDiv'>
              <ListOfNotes isBigScreen={isBigScreen} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} everyGroup={everyGroup} />
            </div>
          </>

          :
          //if the screen size is small, i.e less than 700px then it renders either Group Section or List Section based on what user have selected.
          (selectedGroup ?
            <ListOfNotes isBigScreen={isBigScreen} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} everyGroup={everyGroup} />
            :
            <GroupsSec setOpenGroupPopUp={setOpenGroupPopUp} setGroups={setGroups} everyGroup={everyGroup} setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
          )
      }

      {
        //2nd conditional rendering 
        // A create new group pop up form will render when user click on plus button 
        openGroupPopUP &&
        <div className='newGroupBox'>
          <div className='grpForm'>
            {/*Heading and Close Button */}
            <span className='show'>
              <h2 className='createGrpHeading'>Create New Group </h2>
              <button
                className='backBtn'
                onClick={() => { setOpenGroupPopUp(false); updateColor(); }}>

                <img
                  className='backButton'
                  src={closeIcon}>
                </img>
              </button>
            </span>

            {/*Group Name and Group Name Input */}
            <div className='inputContainer'>
              <span className='grpInputStyle' >
                <label className='grpName'>Group Name</label>
                <input
                  ref={nameReference}
                  className='grpInput'
                  type='text'
                  placeholder='Enter Group Name'>
                </input>
              </span>

              {/*Choose Color*/}
              <span className='grpInputStyle'>
                <label className='chooseColor'>Choose Colour</label>

                {/*Generates the array of keys of pickColor Object and map is used to iterate over array returned by obj.keys and create a span element for each iteration */}
                <div className='colorsContainer'>
                  {Object.keys(pickColor).map((colorHexCode, index) =>
                    <span
                      onClick={() => {
                        colorPicked = colorHexCode;
                        let otherColors = {};
                        Object.entries(pickColor).map(([color, index]) => {
                          if (color !== colorPicked) {
                            otherColors[color] = false;
                          }
                          else {
                            otherColors[color] = true;
                          }
                        })
                        setPickColors(() => otherColors);
                      }
                      }
                      key={colorHexCode}
                      style={!pickColor[colorHexCode] ? { background: colorHexCode } : { border: "solid 3px grey", background: colorHexCode }}
                      className='pickColor'>
                    </span>
                  )
                  }
                </div>
              </span>
            </div>

            {/*Create Button */}
            <div className='createBtnDiv'>
              <button onClick={addGroupList} className='createBtn'>Create</button>
            </div>

          </div>
        </div>
      }
    </>
  );
}

export default App;
