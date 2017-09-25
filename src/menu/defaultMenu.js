//import intl  from 'react-intl-universal'

const getMenu = (app) => {

  return [
    {
      label : 'FontMoa',
      submenu : [
        { 
          label : 'Checking For Update', 
          enabled : app.isUpdateReady(),
          click : () => { 
            app.checkingForUpdate() 
          },
        },
        {type: 'separator'},
        {role : 'close'}
      ]
    },
    {
      label: 'Help',
      submenu : [
        {role: 'toggledevtools'},
        {type: 'separator'},
        { label : 'About FontMoa'}
      ]
    }
  ]
}

export default getMenu