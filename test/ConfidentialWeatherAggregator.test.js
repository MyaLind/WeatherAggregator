const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialWeatherAggregator", function () {
  let weatherAggregator;
  let owner;
  let station1;
  let station2;
  let station3;
  let user;

  beforeEach(async function () {
    [owner, station1, station2, station3, user] = await ethers.getSigners();

    const ConfidentialWeatherAggregator = await ethers.getContractFactory(
      "ConfidentialWeatherAggregator"
    );
    weatherAggregator = await ConfidentialWeatherAggregator.deploy();
    await weatherAggregator.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await weatherAggregator.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero stations", async function () {
      expect(await weatherAggregator.stationCount()).to.equal(0);
    });

    it("Should initialize with zero forecasts", async function () {
      expect(await weatherAggregator.forecastCount()).to.equal(0);
    });

    it("Should have time window enabled by default", async function () {
      expect(await weatherAggregator.timeWindowEnabled()).to.equal(true);
    });
  });

  describe("Station Registration", function () {
    it("Should allow owner to register a station", async function () {
      await expect(
        weatherAggregator.registerStation(station1.address, "Tokyo")
      )
        .to.emit(weatherAggregator, "StationRegistered")
        .withArgs(0, station1.address, "Tokyo");

      expect(await weatherAggregator.stationCount()).to.equal(1);
    });

    it("Should not allow non-owner to register stations", async function () {
      await expect(
        weatherAggregator.connect(station1).registerStation(station2.address, "Seoul")
      ).to.be.revertedWith("Only owner can call this");
    });

    it("Should not allow registering zero address", async function () {
      await expect(
        weatherAggregator.registerStation(ethers.ZeroAddress, "Invalid")
      ).to.be.revertedWith("Invalid station address");
    });

    it("Should retrieve station info correctly", async function () {
      await weatherAggregator.registerStation(station1.address, "Tokyo");

      const stationInfo = await weatherAggregator.getStationInfo(0);
      expect(stationInfo.stationAddress).to.equal(station1.address);
      expect(stationInfo.location).to.equal("Tokyo");
      expect(stationInfo.isActive).to.equal(true);
      expect(stationInfo.submissionCount).to.equal(0);
    });

    it("Should register multiple stations", async function () {
      await weatherAggregator.registerStation(station1.address, "Tokyo");
      await weatherAggregator.registerStation(station2.address, "Seoul");
      await weatherAggregator.registerStation(station3.address, "Beijing");

      expect(await weatherAggregator.stationCount()).to.equal(3);
      expect(await weatherAggregator.getActiveStationCount()).to.equal(3);
    });
  });

  describe("Station Deactivation", function () {
    beforeEach(async function () {
      await weatherAggregator.registerStation(station1.address, "Tokyo");
      await weatherAggregator.registerStation(station2.address, "Seoul");
    });

    it("Should allow owner to deactivate a station", async function () {
      await expect(weatherAggregator.deactivateStation(0))
        .to.emit(weatherAggregator, "StationDeactivated")
        .withArgs(0);

      const stationInfo = await weatherAggregator.getStationInfo(0);
      expect(stationInfo.isActive).to.equal(false);
    });

    it("Should not allow non-owner to deactivate stations", async function () {
      await expect(
        weatherAggregator.connect(station1).deactivateStation(0)
      ).to.be.revertedWith("Only owner can call this");
    });

    it("Should revert when deactivating already inactive station", async function () {
      await weatherAggregator.deactivateStation(0);
      await expect(weatherAggregator.deactivateStation(0))
        .to.be.revertedWith("Station already inactive");
    });

    it("Should update active station count", async function () {
      expect(await weatherAggregator.getActiveStationCount()).to.equal(2);
      await weatherAggregator.deactivateStation(0);
      expect(await weatherAggregator.getActiveStationCount()).to.equal(1);
    });
  });

  describe("Time Window Management", function () {
    it("Should allow owner to toggle time window", async function () {
      await expect(weatherAggregator.setTimeWindowEnabled(false))
        .to.emit(weatherAggregator, "TimeWindowToggled")
        .withArgs(false);

      expect(await weatherAggregator.timeWindowEnabled()).to.equal(false);
    });

    it("Should not allow non-owner to toggle time window", async function () {
      await expect(
        weatherAggregator.connect(station1).setTimeWindowEnabled(false)
      ).to.be.revertedWith("Only owner can call this");
    });

    it("Should affect submission and generation availability", async function () {
      // With time window enabled, these might be false depending on current time
      await weatherAggregator.setTimeWindowEnabled(false);

      // With time window disabled, should always return true
      expect(await weatherAggregator.canSubmitData()).to.equal(true);
      expect(await weatherAggregator.canGenerateForecast()).to.equal(true);
    });
  });

  describe("Weather Data Submission", function () {
    beforeEach(async function () {
      await weatherAggregator.registerStation(station1.address, "Tokyo");
      await weatherAggregator.registerStation(station2.address, "Seoul");
      await weatherAggregator.registerStation(station3.address, "Beijing");

      // Disable time window for testing
      await weatherAggregator.setTimeWindowEnabled(false);
    });

    it("Should allow registered station to submit data", async function () {
      // Note: In real implementation, these would be encrypted euint values
      // For testing, we use mock values
      await expect(
        weatherAggregator.connect(station1).submitWeatherData(
          2250, // 22.5°C * 100
          6500, // 65% * 100
          10130, // 1013 hPa * 100
          15 // 15 km/h
        )
      ).to.emit(weatherAggregator, "WeatherDataSubmitted");

      const stationInfo = await weatherAggregator.getStationInfo(0);
      expect(stationInfo.submissionCount).to.equal(1);
    });

    it("Should not allow unregistered address to submit data", async function () {
      await expect(
        weatherAggregator.connect(user).submitWeatherData(2250, 6500, 10130, 15)
      ).to.be.revertedWith("Not a registered station");
    });

    it("Should not allow inactive station to submit data", async function () {
      await weatherAggregator.deactivateStation(0);

      await expect(
        weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15)
      ).to.be.revertedWith("Station not active");
    });

    it("Should prevent double submission in same period", async function () {
      await weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15);

      await expect(
        weatherAggregator.connect(station1).submitWeatherData(2300, 7000, 10150, 20)
      ).to.be.revertedWith("Already submitted this period");
    });

    it("Should track submission status correctly", async function () {
      expect(await weatherAggregator.hasStationSubmitted(0)).to.equal(false);

      await weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15);

      expect(await weatherAggregator.hasStationSubmitted(0)).to.equal(true);
    });
  });

  describe("Regional Forecast Generation", function () {
    beforeEach(async function () {
      // Register 3 stations
      await weatherAggregator.registerStation(station1.address, "Tokyo");
      await weatherAggregator.registerStation(station2.address, "Seoul");
      await weatherAggregator.registerStation(station3.address, "Beijing");

      // Disable time window for testing
      await weatherAggregator.setTimeWindowEnabled(false);
    });

    it("Should not generate forecast with insufficient stations", async function () {
      await weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15);

      await expect(
        weatherAggregator.generateRegionalForecast()
      ).to.be.revertedWith("Need minimum 3 stations");
    });

    it("Should generate forecast with 3+ stations", async function () {
      // All 3 stations submit data
      await weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15);
      await weatherAggregator.connect(station2).submitWeatherData(1830, 7250, 10200, 12);
      await weatherAggregator.connect(station3).submitWeatherData(2010, 5870, 10050, 18);

      await expect(weatherAggregator.generateRegionalForecast())
        .to.emit(weatherAggregator, "RegionalForecastGenerated");

      expect(await weatherAggregator.forecastCount()).to.equal(1);
    });

    it("Should not allow duplicate forecast in same period", async function () {
      await weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15);
      await weatherAggregator.connect(station2).submitWeatherData(1830, 7250, 10200, 12);
      await weatherAggregator.connect(station3).submitWeatherData(2010, 5870, 10050, 18);

      await weatherAggregator.generateRegionalForecast();

      await expect(
        weatherAggregator.generateRegionalForecast()
      ).to.be.revertedWith("Forecast already generated this period");
    });

    it("Should retrieve forecast info correctly", async function () {
      await weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15);
      await weatherAggregator.connect(station2).submitWeatherData(1830, 7250, 10200, 12);
      await weatherAggregator.connect(station3).submitWeatherData(2010, 5870, 10050, 18);

      await weatherAggregator.generateRegionalForecast();

      const forecastInfo = await weatherAggregator.getRegionalForecast(0);
      expect(forecastInfo.participatingStations).to.equal(3);
      expect(forecastInfo.isGenerated).to.equal(true);
    });
  });

  describe("Current Forecast Info", function () {
    beforeEach(async function () {
      await weatherAggregator.registerStation(station1.address, "Tokyo");
      await weatherAggregator.registerStation(station2.address, "Seoul");
      await weatherAggregator.registerStation(station3.address, "Beijing");
      await weatherAggregator.setTimeWindowEnabled(false);
    });

    it("Should return correct current forecast info", async function () {
      const info = await weatherAggregator.getCurrentForecastInfo();

      expect(info.currentForecastId).to.equal(0);
      expect(info.submittedStations).to.equal(0);
    });

    it("Should update submitted stations count", async function () {
      await weatherAggregator.connect(station1).submitWeatherData(2250, 6500, 10130, 15);

      const info = await weatherAggregator.getCurrentForecastInfo();
      expect(info.submittedStations).to.equal(1);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to call owner functions", async function () {
      await expect(
        weatherAggregator.connect(user).registerStation(station1.address, "Tokyo")
      ).to.be.revertedWith("Only owner can call this");

      await expect(
        weatherAggregator.connect(user).setTimeWindowEnabled(false)
      ).to.be.revertedWith("Only owner can call this");

      await expect(
        weatherAggregator.connect(user).deactivateStation(0)
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  describe("Edge Cases", function () {
    beforeEach(async function () {
      await weatherAggregator.registerStation(station1.address, "Tokyo");
      await weatherAggregator.setTimeWindowEnabled(false);
    });

    it("Should handle maximum values for weather data", async function () {
      await expect(
        weatherAggregator.connect(station1).submitWeatherData(
          10000, // 100°C * 100 (max)
          10000, // 100% * 100 (max)
          11000, // 1100 hPa * 100 (max)
          200 // 200 km/h (max)
        )
      ).to.not.be.reverted;
    });

    it("Should handle minimum values for weather data", async function () {
      await expect(
        weatherAggregator.connect(station1).submitWeatherData(
          0, // -100°C would be stored as 0 after encryption
          0, // 0%
          90000, // 900 hPa * 100 (min)
          0 // 0 km/h
        )
      ).to.not.be.reverted;
    });

    it("Should get current hour correctly", async function () {
      const currentHour = await weatherAggregator.getCurrentHour();
      expect(currentHour).to.be.at.least(0).and.at.most(23);
    });
  });
});
