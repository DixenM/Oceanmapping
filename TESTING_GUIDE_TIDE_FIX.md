# Tide Data Fix - Testing Guide

## Overview
This document provides instructions for testing the "Failed to load tide data" error fix.

## What Was Fixed

### 1. API Key Environment Variable
- **Changed**: `VITE_WORLDTIDES_API_KEY` → `VITE_WORLDTIDES_KEY`
- **Why**: Consistency and simplification
- **Updated files**: 
  - `src/services/tideApi.ts`
  - `.env.example`

### 2. Error Handling Improvements
- Added API key validation before making requests
- Specific error messages for different failure scenarios:
  - Missing API key
  - Invalid API key (401/403)
  - Rate limit exceeded (429)
  - Request timeout (10 seconds)
  - No tide data available
  - Network errors
- Better user-facing error messages in UI

### 3. Debug Logging (Development Mode Only)
- API key presence check (doesn't expose actual key)
- Request URL logging (with masked key)
- Response data logging
- Error logging with context

### 4. Enhanced UI Error Display
- Shows specific error message from API
- Displays helpful hints for API key issues
- Better CSS styling for error states

## Setup for Testing

### 1. Get a WorldTides API Key
Visit [https://www.worldtides.info/](https://www.worldtides.info/) to get an API key.

### 2. Configure Environment
Create a `.env` file in the project root:

```bash
# Copy from example
cp .env.example .env

# Edit the file
nano .env  # or use your preferred editor
```

Add your API key:
```env
VITE_WORLDTIDES_KEY=your_actual_api_key_here
```

### 3. Install Dependencies (if not already done)
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

## Testing Scenarios

### Test 1: With Valid API Key ✅

**Setup**: Configure `.env` with valid API key

**Steps**:
1. Run `npm run dev`
2. Open browser console (F12)
3. Click on **Aarhus Havn** station on the map
   - Coordinates: 56.1496, 10.2134

**Expected Results**:
- ✅ Console logs:
  ```
  [TideAPI] API Key loaded: ✓ Present
  [TideAPI] Fetching tide data for lat: 56.1496, lon: 10.2134
  [useTideData] Fetching tide data for lat: 56.1496, lon: 10.2134
  [TideAPI] Successfully fetched tide data: {...}
  ```
- ✅ Popup shows:
  - Current tide height
  - Tide status (Rising/Falling/High/Low) with colored banner
  - List of upcoming high/low tides
- ✅ No errors in console

### Test 2: Missing API Key ⚠️

**Setup**: Remove or comment out `VITE_WORLDTIDES_KEY` in `.env`

**Steps**:
1. Restart dev server: `npm run dev`
2. Open browser console
3. Click on any tide station

**Expected Results**:
- ✅ Console logs:
  ```
  [TideAPI] API Key loaded: ✗ Missing
  [TideAPI] Using key: NONE
  [TideAPI] API key not configured. Please add VITE_WORLDTIDES_KEY to your .env file.
  ```
- ✅ Popup shows:
  - Loading spinner (briefly)
  - Error message: **"⚠️ API key not configured. Please add VITE_WORLDTIDES_KEY to your .env file."**
  - Hint: **"Please configure your WorldTides API key in the .env file."**
- ✅ User-friendly, actionable error message

### Test 3: Invalid API Key 🔑

**Setup**: Set `VITE_WORLDTIDES_KEY=invalid-key-12345` in `.env`

**Steps**:
1. Restart dev server
2. Click on any tide station

**Expected Results**:
- ✅ Console log: `[TideAPI] API error 401: Unauthorized` (or 403)
- ✅ Popup error: **"⚠️ Invalid API key. Please check your VITE_WORLDTIDES_KEY."**
- ✅ Error is specific and actionable

### Test 4: Network Issues 🌐

**Setup**: Valid API key, but disconnect internet or use network throttling

**Steps**:
1. Open DevTools → Network tab
2. Set throttling to "Offline" or "Slow 3G"
3. Click on a tide station

**Expected Results**:
- ✅ Shows loading state
- ✅ After timeout or failure: **"⚠️ Failed to load tide data. Please check your connection and try again."**
- ✅ Console error with details

### Test 5: Multiple Stations 🗺️

**Setup**: Valid API key

**Steps**:
1. Click on **Aarhus** station → Close popup
2. Click on **Copenhagen** station → Close popup
3. Click back on **Aarhus** station

**Expected Results**:
- ✅ Each station loads its own data
- ✅ Second click on Aarhus should be faster (cached for 5 minutes)
- ✅ Console shows cache hit: `[useTideData] Successfully fetched tide data`

## Unit Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
npm test src/services/tideApi.test.ts
npm test src/hooks/useTideData.test.ts
```

### Run with Coverage
```bash
npm run test:coverage
```

### Test Coverage
- **tideApi.ts**: API key validation, input validation
- **useTideData.ts**: Hook behavior, caching, error handling

Current test results:
```
Test Files  2 passed (2)
Tests  10 passed (10)
```

## Debugging Tips

### Enable Verbose Logging
Debug logs only appear in development mode (`npm run dev`), not in production builds.

### Check Console Logs
All debug logs are prefixed:
- `[TideAPI]` - API service logs
- `[useTideData]` - Hook logs

### Common Issues

**Issue**: "API key not configured" but I have a .env file
- **Solution**: Make sure variable name is `VITE_WORLDTIDES_KEY` (not `VITE_WORLDTIDES_API_KEY`)
- **Solution**: Restart dev server after changing .env file

**Issue**: Logs show "API Key loaded: ✓ Present" but still get errors
- **Solution**: Check if key is valid at worldtides.info
- **Solution**: Check browser console for specific API error (401, 403, 429)

**Issue**: No console logs appear
- **Solution**: Make sure you're running `npm run dev` (not production build)
- **Solution**: Open browser console (F12)

## Files Changed

```
.env.example                     - Updated variable name
src/services/tideApi.ts          - API key fix + error handling
src/hooks/useTideData.ts         - Better error logging
src/components/TideInfoPopup.tsx - Enhanced error display
src/styles/TideInfoPopup.css     - Error hint styling
src/services/tideApi.test.ts     - NEW: Unit tests
src/hooks/useTideData.test.ts    - NEW: Unit tests
```

## Success Criteria

- ✅ API key loads correctly with new variable name
- ✅ Clear error message when API key is missing
- ✅ Specific error messages for different failure types
- ✅ Debug logging helps developers troubleshoot
- ✅ User-friendly error messages in UI
- ✅ All unit tests passing
- ✅ Works with real Aarhus coordinates (56.1496, 10.2134)

## Next Steps

After testing:
1. Verify all scenarios work as expected
2. Test with real API key
3. Check error states are user-friendly
4. Confirm console logs are helpful for debugging
5. Review PR and merge if all tests pass

---

**Tested Locations**:
- Aarhus Havn: 56.1496, 10.2134
- Copenhagen: ~55.6761, 12.5872
- Aalborg: Check stations.ts for coordinates

**Need Help?**
- Check the console for detailed error messages
- Verify `.env` file has correct variable name
- Ensure dev server is restarted after .env changes
