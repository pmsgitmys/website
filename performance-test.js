const https = require('https');
const http = require('http');

// Performance testing function
async function performanceTest() {
  const baseUrl = 'http://localhost:3002';
  const tests = [
    { name: 'Homepage Load', path: '/' },
    { name: 'Products Page', path: '/products' },
    { name: 'Products with Category Filter', path: '/products?category=smartphones' },
    { name: 'Admin Dashboard', path: '/admin' },
    { name: 'Auth Session Check', path: '/api/auth/session' },
    { name: 'Signin Page', path: '/auth/signin' },
    { name: 'Cart Page', path: '/cart' },
    { name: 'Checkout Page', path: '/checkout' },
    { name: 'Orders Page', path: '/orders' },
    { name: 'Wishlist Page', path: '/wishlist' }
  ];

  console.log('🚀 Starting Performance Tests...\n');

  const results = [];

  for (const test of tests) {
    try {
      const startTime = Date.now();

      await new Promise((resolve, reject) => {
        const req = http.get(`${baseUrl}${test.path}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            results.push({
              name: test.name,
              path: test.path,
              statusCode: res.statusCode,
              responseTime: responseTime,
              contentLength: data.length,
              status: res.statusCode === 200 ? '✅ PASS' : '❌ FAIL'
            });
            resolve();
          });
        });

        req.on('error', (err) => {
          results.push({
            name: test.name,
            path: test.path,
            statusCode: 'ERROR',
            responseTime: 0,
            contentLength: 0,
            status: '❌ ERROR',
            error: err.message
          });
          resolve();
        });

        req.setTimeout(10000, () => {
          req.destroy();
          results.push({
            name: test.name,
            path: test.path,
            statusCode: 'TIMEOUT',
            responseTime: 10000,
            contentLength: 0,
            status: '⏰ TIMEOUT'
          });
          resolve();
        });
      });

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error testing ${test.name}:`, error);
    }
  }

  // Generate report
  console.log('📊 Performance Test Results:\n');
  console.log('| Test Name | Status | Response Time | Status Code | Content Size |');
  console.log('|-----------|--------|---------------|-------------|--------------|');

  results.forEach(result => {
    const responseTime = `${result.responseTime}ms`;
    const contentSize = `${(result.contentLength / 1024).toFixed(1)}KB`;
    console.log(`| ${result.name.padEnd(20)} | ${result.status.padEnd(8)} | ${responseTime.padEnd(13)} | ${result.statusCode.toString().padEnd(11)} | ${contentSize.padEnd(12)} |`);
  });

  // Summary statistics
  const validResults = results.filter(r => typeof r.responseTime === 'number' && r.responseTime > 0);
  const avgResponseTime = validResults.reduce((sum, r) => sum + r.responseTime, 0) / validResults.length;
  const maxResponseTime = Math.max(...validResults.map(r => r.responseTime));
  const minResponseTime = Math.min(...validResults.map(r => r.responseTime));
  const passRate = (results.filter(r => r.status === '✅ PASS').length / results.length * 100).toFixed(1);

  console.log('\n📈 Summary Statistics:');
  console.log(`• Pass Rate: ${passRate}%`);
  console.log(`• Average Response Time: ${avgResponseTime.toFixed(1)}ms`);
  console.log(`• Fastest Response: ${minResponseTime}ms`);
  console.log(`• Slowest Response: ${maxResponseTime}ms`);
  console.log(`• Total Tests: ${results.length}`);
  console.log(`• Passed Tests: ${results.filter(r => r.status === '✅ PASS').length}`);
  console.log(`• Failed Tests: ${results.filter(r => r.status !== '✅ PASS').length}`);
}

// Load testing function
async function loadTest() {
  console.log('\n🔥 Starting Load Test (50 concurrent requests to homepage)...\n');

  const concurrentRequests = 50;
  const promises = [];
  const startTime = Date.now();

  for (let i = 0; i < concurrentRequests; i++) {
    promises.push(new Promise((resolve) => {
      const requestStart = Date.now();
      const req = http.get('http://localhost:3002/', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const requestEnd = Date.now();
          resolve({
            status: res.statusCode,
            responseTime: requestEnd - requestStart,
            contentLength: data.length
          });
        });
      });

      req.on('error', () => {
        resolve({ status: 'ERROR', responseTime: 0, contentLength: 0 });
      });

      req.setTimeout(15000, () => {
        req.destroy();
        resolve({ status: 'TIMEOUT', responseTime: 15000, contentLength: 0 });
      });
    }));
  }

  const results = await Promise.all(promises);
  const totalTime = Date.now() - startTime;

  const successfulRequests = results.filter(r => r.status === 200);
  const avgResponseTime = successfulRequests.reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests.length;
  const maxResponseTime = Math.max(...results.map(r => r.responseTime));
  const minResponseTime = Math.min(...results.filter(r => r.responseTime > 0).map(r => r.responseTime));
  const successRate = (successfulRequests.length / results.length * 100).toFixed(1);
  const requestsPerSecond = (results.length / (totalTime / 1000)).toFixed(2);

  console.log('🔥 Load Test Results:');
  console.log(`• Success Rate: ${successRate}%`);
  console.log(`• Requests Per Second: ${requestsPerSecond}`);
  console.log(`• Average Response Time: ${avgResponseTime.toFixed(1)}ms`);
  console.log(`• Min Response Time: ${minResponseTime}ms`);
  console.log(`• Max Response Time: ${maxResponseTime}ms`);
  console.log(`• Total Test Duration: ${totalTime}ms`);
  console.log(`• Concurrent Requests: ${concurrentRequests}`);
  console.log(`• Successful Requests: ${successfulRequests.length}/${results.length}`);
}

// Database stress test
async function databaseStressTest() {
  console.log('\n💾 Starting Database Stress Test...\n');

  // Test multiple rapid requests to data-heavy endpoints
  const endpoints = [
    '/products',
    '/products?category=smartphones',
    '/products?category=laptops',
    '/products?category=audio'
  ];

  const results = [];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}...`);
    const promises = [];

    for (let i = 0; i < 10; i++) {
      promises.push(new Promise((resolve) => {
        const start = Date.now();
        const req = http.get(`http://localhost:3002${endpoint}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({
              endpoint,
              responseTime: Date.now() - start,
              status: res.statusCode,
              dataSize: data.length
            });
          });
        });
        req.on('error', () => resolve({ endpoint, responseTime: 0, status: 'ERROR', dataSize: 0 }));
      }));
    }

    const endpointResults = await Promise.all(promises);
    results.push(...endpointResults);
  }

  console.log('💾 Database Stress Test Results:');
  endpoints.forEach(endpoint => {
    const endpointResults = results.filter(r => r.endpoint === endpoint);
    const avgTime = endpointResults.reduce((sum, r) => sum + r.responseTime, 0) / endpointResults.length;
    const successRate = (endpointResults.filter(r => r.status === 200).length / endpointResults.length * 100).toFixed(1);
    console.log(`• ${endpoint}: Avg ${avgTime.toFixed(1)}ms, Success: ${successRate}%`);
  });
}

// Run all tests
async function runAllTests() {
  try {
    await performanceTest();
    await loadTest();
    await databaseStressTest();
    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

runAllTests();