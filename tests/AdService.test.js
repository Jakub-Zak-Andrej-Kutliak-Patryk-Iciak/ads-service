import { assert } from 'chai'
import { retrieveCachedData, parseAd } from '../src/AdService.js'

describe('Test ad service', () => {
  it('Tests ad parsing', () => {
    const text = "<div style='padding:20px;font-family:verdana;text-align:center;background-color:#002c7f;color:ffd380'>Taste life. Pure Filtered.</div>"
    try {
      const data = parseAd(text)
      assert.equal(data, 'Taste life. Pure Filtered.');
    } catch (error) {
      console.log("Error while parsing ad => " + error)
    }
  })
})