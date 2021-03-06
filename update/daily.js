#! /usr/bin/env

const fs = require('fs-extra')
const path = require('path')
const pumpify = require('pumpify')
const through = require('through2')
const crossref = require('crossref-retractions')
const retraction = require('open-retractions-datum')
const writedoi = require('./writedoi')

// let last_pubmed
let last_crossref
//
// try {
//   const entry = JSON.parse(fs.readFileSync('./last_pubmed.json', 'utf8'))
//   last_pubmed = entry.timestamp
//   console.log('Getting PubMed since', timestamp)
// } catch (e) {
//   console.log('Getting all PubMed')
//   fs.writeFileSync('./last_pubmed.json','utf8', JSON.stringify({
//     timestamp: (new Date()).unixtime
//   }))
// }

try {
  const entry = JSON.parse(fs.readFileSync('./last_crossref.json', 'utf8'))
  last_crossref = new Date(entry.timestamp).toISOString().split('T')[0]
  console.log('Getting CrossRef since', last_crossref)
} catch (e) {
  console.log('Getting all CrossRef')
  fs.writeJsonSync('./last_crossref.json', { timestamp: (new Date()).getTime() })
}

pumpify(
  crossref(date = last_crossref),
  retraction.crossref.stream(),
  writedoi()
)
