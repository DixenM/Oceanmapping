import { fetchMarineWeather, evaluateConditions, formatWindDirection, getWaveHeightColor } from '../src/services/marineWeatherService.js';

async function testMarineWeatherService() {
  console.log('Testing Marine Weather Service...\n');

  const testLat = 55.6761;
  const testLon = 12.5683;

  console.log(`Fetching marine weather for Copenhagen Harbor (${testLat}, ${testLon})...`);

  try {
    const data = await fetchMarineWeather(testLat, testLon);

    console.log('\n✓ Successfully fetched marine weather data');
    console.log('\nCurrent Conditions:');
    console.log(`  Wave Height: ${data.current.waveHeight.toFixed(2)}m`);
    console.log(`  Wind Speed: ${data.current.windSpeed.toFixed(1)} km/h`);
    console.log(`  Wind Direction: ${formatWindDirection(data.current.windDirection)} (${data.current.windDirection}°)`);
    console.log(`  Wind Wave Height: ${data.current.windWaveHeight.toFixed(2)}m`);

    console.log('\nSafety Assessment:');
    console.log(`  Status: ${data.conditions.status.toUpperCase()}`);
    console.log(`  Level: ${data.conditions.level}/3`);
    console.log(`  Message: ${data.conditions.message}`);
    console.log(`  Warnings: ${data.conditions.warnings.join(', ')}`);

    console.log('\nForecast (Next 6 hours):');
    data.forecast.slice(0, 6).forEach((item, idx) => {
      const time = new Date(item.time).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
      console.log(`  ${time}: Wave ${item.waveHeight.toFixed(1)}m, Wind ${item.windSpeed.toFixed(0)} km/h`);
    });

    console.log('\nColor Mapping Test:');
    console.log(`  0.5m wave: ${getWaveHeightColor(0.5)}`);
    console.log(`  2.0m wave: ${getWaveHeightColor(2.0)}`);
    console.log(`  4.0m wave: ${getWaveHeightColor(4.0)}`);

    console.log('\n✓ All tests passed!\n');
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

testMarineWeatherService();
