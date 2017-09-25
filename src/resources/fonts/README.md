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
            // names is options 
            "names" : {
                "copyright" : "Copyright",
                "family": "Font Family",
                "subfamily": "Font Sub Family",
                "uniqueSubFamily": "Unique subfamily identification.",
                "fullName" : "Full name of the font.",
                "version" : "Version of the name table.",
                "postScriptName": "PostScript name of the font. All PostScript names in a font must be identical.",
                "trademark" : "TradeMark",
                "manufacturer" : "Manufacturer name.",
                "designer" : "Designer; name of the designer of the typeface.",
                "description" : "Description; description of the typeface.",
                "vendorUrl" : "URL of the font vendor",
                "designerUrl" : "URL of the font designer ",
                "downloadUrl" : "Font File to download ",
                "licenseUrl": "	License information URL",
                "license": "License description; description of how the font may be legally used, or different example scenarios for licensed use. This field should be written in plain language, not legalese.",
            },
            "previewImage" : "Font Preview Image",            
            "buyUrl": "Buy Link",
            "labels" : [ "label",  .... ]    // for search , ex ) happy, smile, handwriting, etc ... 
        }
    ]
}

```

## Implements FontItemClass component

src/component/FontItem/XXXFontItem.js 

