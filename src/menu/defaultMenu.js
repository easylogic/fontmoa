//import intl  from 'react-intl-universal'

const getMenu = (app) => {

  let submenu =[
  ]

  if( app.isUpdateReady()) {
    submenu.push(  { 
      label : 'Checking For Update', 
      click : () => { 
        app.checkingForUpdate() 
      },
    })
  }

  if (submenu.length) {
    submenu.push({type: 'separator'});
  }
  submenu.push({role: 'close'});

  return [
    {
      label : 'Fontmoa',
      submenu
    }
  ]
}

export default getMenu