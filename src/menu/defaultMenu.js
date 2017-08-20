import intl  from 'react-intl-universal'

const getMenu = (app) => {
  return [
        { 
          label : intl.get('menu.view.language.label'), 
          submenu : [
            { 
              type : "radio", 
              label : "English", 
              checked: app.state.locale === 'en', 
              value: 'en', 
              click : (item) => { app.loadLocales(item.value); }
            },
            { 
              type : "radio", 
              label : "한국어", 
              checked:  app.state.locale === 'ko', 
              value: 'ko', 
              click : (item) => { app.loadLocales(item.value); } 
            }
          ] 
        },        
        {type: 'separator'},        
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    }
  ]
}

export default getMenu