let tress = require('tress')
let needle = require('needle')
let moment = require('moment')
let notification = require('./notification');
(function () {
  let languages = [
    'fr', 'en', 'es', 'it', 'pt', 'de', 'ru'
  ]
  let platforms = [
    'android', 'ios', 'web'
  ]
  let receivedEmail=''//just for API testing
  const mainLink = 'https://content.mosalingua.com/export/statistic/{translation}/{original}/{platform}'
  let report = []
  /**
   * Make a queue for requests
   * @type {tress}
   */

  const q = tress(getDataFromLink)

  q.drain = function () {
    console.log('DONE')
    console.log(report)
    if (report.length > 0) {
      //Code for sending Email
      notification.send(report,receivedEmail)
      report=[]
    }
  }

  /**
   * Generate array for all combinations of languages and platforms
   */
  function generateLinksArray () {
    languages.map(item => {
      languages.map(_item => {
        platforms.map(platform => {
          if (item !== _item) {
            let tmpLink = mainLink.replace('{translation}', item)
            tmpLink = tmpLink.replace('{original}', _item)
            tmpLink = tmpLink.replace('{platform}', platform)
            q.push(tmpLink)
          }
        })
      })
    })
  }

  /**
   * send get request to get json data and parse it.
   */
  function getDataFromLink (url, callback) {
    needle.get(url, function (err, res) {
      console.log('Check URl:' + url)

      let items = res.body.items
      //get yesterdays records

      /**
       * Steps
       * get yesterday's record.
       * get latest record except yesterdays.
       * compare
       * profit ;)
       * @type {Int32Array | * | Uint32Array | T[] | Int8Array | Float64Array}
       */
      let yesterdaysItems = items.filter(item => {
        let yesterday = moment().subtract(1, 'days').format('MMMM Do YYYY')
        //for testing
        // let yesterday = moment('2019-09-19').format('MMMM Do YYYY')
        return moment(item.date).format('MMMM Do YYYY') === yesterday
      })

      /**
       * Make array without yesterday's records
       * @type {Int32Array | * | Uint32Array | T[] | Int8Array | Float64Array}
       */
      let arrayWithoutYesterdays = items.filter(item => {
        let ifElementExist = yesterdaysItems.some(__item => {
          return __item.date === item.date
        })
        return !ifElementExist
      })

      let latestRecordBeforeYesterday = arrayWithoutYesterdays[0]
      yesterdaysItems.push(latestRecordBeforeYesterday)

      /*
     * Get latest record before yesterday
     */

      // let latestRecordBeforeYesterday

      //check if length of array more than 1 (need to calculate delta)
      if (yesterdaysItems.length > 1) {
        //calculate delta cards and categories
        let lastElementIndex = yesterdaysItems.length - 1
        let deltaCategories = yesterdaysItems[lastElementIndex].numberCategories - yesterdaysItems[0].numberCategories
        let deltaCards = yesterdaysItems[lastElementIndex].numberCards - yesterdaysItems[0].numberCards
        if (deltaCards || deltaCategories) {
          report.push({
            name: yesterdaysItems[0].name,
            date: yesterdaysItems[0].date,
            cards: yesterdaysItems[0].numberCards,
            categories: yesterdaysItems[0].numberCategories,
            deltaCards,
            deltaCategories
          })
        }
      }

      callback()
    })
  }

  // generateLinksArray()

  exports.run=function (email) {
    generateLinksArray()
    receivedEmail=email
  }

})()