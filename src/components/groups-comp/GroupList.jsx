import React from 'react'


/*This component is used to highlight selected group 
 pick first 2 letters of group name
 show the name of group  beside the first 2 letters*/

function GroupList(props) {

  return (
    <>
      <div
        style={props.id == props.selectedGroup ? { background: "#2F2F2F2B", width: "100%" } : { background: "white" }}
        className='individualGroup'
        onClick={() => { props.setSelectedGroup(props.id) }}>

        <div
          style={{ background: props.groupIconColor }}
          className='groupIcon'>

          {props.name.slice(0, 2).toUpperCase()}
        </div>
        
        <div className='groupName'>
          {props.name}
        </div>

      </div>
    </>
  )
}

export default GroupList