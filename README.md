![Image](./public/assets/images/MarchioCompleto.png)

# EndoStats
App created to support and help the work of [Endocare Onlus](https://www.endo-care.it/).


## Description
This app is meant to read data from a specific excell file and separate/organize them in different and specific tables.</br>
This app is not meant to alter the data inside the excell but only to visualize it in an easier way.

There are 3 different tables:
- #### Gruppo multidisciplinare (G)
|Riga|Nome|Cognome|Data ins.|Diagnosi|
|:------:|:------:|:------:|:------:|:------:|
|Row number|Name|Surname|Insertion date|Diagnosis|
|`number`|`string`|`string`|`string`|`string`|

- #### Ambulatorio (A)
|Riga|Nome|Cognome|Data ins.|Diagnosi|N° tel.|
|:------:|:------:|:------:|:------:|:------:|:------:|
|Row number|Name|Surname|Insertion date|Diagnosis|Cell number|
|`number`|`string`|`string`|`string`|`string`|`string`|

- #### Da valutare (?)
|Riga|Nome|Cognome|Data ins.|Diagnosi|
|:------:|:------:|:------:|:------:|:------:|
|Row number|Name|Surname|Insertion date|Diagnosis|
|`number`|`string`|`string`|`string`|`string`|

</br>

>**NOTE:** Every table has the possibility to open each row's details and show more data.

## Building
If it's the first time you are cloning this repository run `npm install`.</br>
To start the app for development use the command `npm run start` (or `ng serve`). The app should start without problems.

To build the app for production use the command `npm run build` (or `ng build`), a dist/ folder will be created under the root folder.

>**NOTE:** Every configuration about these commands can be changed in the _package.json_ and _angular.json_ files.


## Contributing
Any help is well accepted, make a pull request and you are on track!

## Forking
If you find this repo of some use feel free to fork!