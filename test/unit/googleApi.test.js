import sinon from 'sinon';

import GoogleApi from '../../js/googleApi.js';

describe('googleApi', function() {

  describe('can geocode', function() {
    let geocodeRequest;

    beforeEach(function() {
      geocodeRequest = sinon.stub(GoogleApi, 'geocodeRequest').returns('yo');
    });

    afterEach(function() {
      GoogleApi.geocodeRequest.restore();
    });

    it ('position', async function() {
      let ret = await GoogleApi.geocodePosition('myKey', {lat: 1.234, lng: 1.14}, 'en');
      expect(geocodeRequest).to.have.been.calledWith(
        'https://maps.google.com/maps/api/geocode/json?key=myKey&latlng=1.234,1.14&language=en');
      expect(ret).to.eql('yo');
    });

    it ('position', async function() {
      let ret = await GoogleApi.geocodePosition('myKey', {lat: 0, lng: 0}, 'en');
      expect(geocodeRequest).to.have.been.calledWith(
        'https://maps.google.com/maps/api/geocode/json?key=myKey&latlng=0,0&language=en');
      expect(ret).to.eql('yo');
    });

    it ('address', async function() {
      let ret = await GoogleApi.geocodeAddress('myKey', "london");
      expect(geocodeRequest).to.have.been.calledWith(
        'https://maps.google.com/maps/api/geocode/json?key=myKey&address=london');
      expect(ret).to.eql('yo');
    });
  });

  describe('geocodeRequest', function() {

    function mockFetch(ret) {
      global.fetch = sinon.stub().returns(Promise.resolve({
        json: () => ret
      }))
    }

    it ('throws if invalid results', function() {
      mockFetch({ status: "NOT_OK" });
      return GoogleApi.geocodeRequest().then(
        () => { throw new Error('cannot be there') },
        (err) => { expect(err.message).to.contain("NOT_OK"); }
      );
    });

    describe('returns formatted results', function() {

      it ('for waterloo-bridge', async function() {
        mockFetch(require('./fixtures/waterloo-bridge.js'));
        let [first, ...ret] = await GoogleApi.geocodeRequest();
        expect(first.countryCode).to.eql('GB');
        expect(first.feature).to.be.eql(null);
        expect(first.locality).to.eql('London');
        expect(first.streetName).to.eql('Waterloo Bridge');
        expect(first.streetNumber).to.eql('76');
      });

      it ('for yosemite park', async function() {
        mockFetch(require('./fixtures/yosemite-park.js'));
        let [first, ...ret] = await GoogleApi.geocodeRequest();
        expect(first.countryCode).to.eql('US');
        expect(first.feature).to.be.eql('Yosemite National Park');
        expect(first.streetName).to.be.eql(null);
        expect(first.streetNumber).to.be.eql(null);
        expect(first.postalCode).to.be.eql(null);
        expect(first.locality).to.be.eql(null);
      });

    });
  });
});
