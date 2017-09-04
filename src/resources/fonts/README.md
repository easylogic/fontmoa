# Font List 

Here is the place to sort the font list.

Do not use images or anything else.

Display the list with purely textual information

If necessary, you can use download links or purchase links.

You can also display your license.


# Support Font List 

* System Font Folder 
* Google Fonts 
* Google Early Access Fonts 
* Free Font List 

## Free Font Item Spec 

you can add  `Free Font Information`  to  src/resources/free-font-list.json 

```json 
{
    "type" : "FreeFonts",
    "items": [
        {
            "family": "Font Family",
            "name": "Font Name",
            "link": "Font Information Link",
            "icon" : "icon class name for material icons",
            "iconImageUrl" : "icon image url 36x36",
            "description": "Description",
            "downloadUrl" : "Font File to download ",
            "licenseUrl": "License Link",
            "license": "License Name",
            "licenseDescription": "License Description",
            "buyUrl": "Buy Link",
            "labels" : [ "label",  .... ]    // for search , ex ) happy, smile, handwriting, etc ... 
        }
    ]
}

```
