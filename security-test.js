const http = require('http');

// Security testing function
async function securityTest() {
  const baseUrl = 'http://localhost:3002';

  console.log('🔒 Starting Security Tests...\n');

  const tests = [
    {
      name: 'SQL Injection Test - Search',
      path: '/api/search?q=\' OR 1=1 --',
      expectedSafe: true
    },
    {
      name: 'XSS Test - Search Parameter',
      path: '/search?q=<script>alert("xss")</script>',
      expectedSafe: true
    },
    {
      name: 'Path Traversal Test',
      path: '/../../../../etc/passwd',
      expectedSafe: true
    },
    {
      name: 'Admin Access Without Auth',
      path: '/admin/users',
      expectedStatusCode: [401, 403, 302], // Should redirect or deny
    },
    {
      name: 'API Endpoint Security',
      path: '/api/admin/delete-all-data',
      expectedStatusCode: [404, 401, 403]
    },
    {
      name: 'File Upload Security',
      path: '/api/upload?file=../../../etc/passwd',
      expectedStatusCode: [404, 401, 403]
    },
    {
      name: 'Session Security',
      path: '/api/auth/session',
      checkHeaders: true
    },
    {
      name: 'CORS Policy Test',
      path: '/',
      checkCORS: true
    }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);

      const result = await new Promise((resolve) => {
        const req = http.get(`${baseUrl}${test.path}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const headers = res.headers;

            let status = '✅ SECURE';
            let details = [];

            // Check status code security
            if (test.expectedStatusCode) {
              if (!test.expectedStatusCode.includes(res.statusCode)) {
                status = '⚠️  WARNING';
                details.push(`Expected status ${test.expectedStatusCode.join(' or ')}, got ${res.statusCode}`);
              }
            }

            // Check for dangerous content in response
            if (data.includes('<script>') || data.includes('alert(') || data.includes('/etc/passwd')) {
              status = '❌ VULNERABLE';
              details.push('Dangerous content detected in response');
            }

            // Check security headers
            if (test.checkHeaders) {
              const securityHeaders = [
                'x-frame-options',
                'x-content-type-options',
                'x-xss-protection',
                'strict-transport-security'
              ];

              securityHeaders.forEach(header => {
                if (!headers[header]) {
                  if (status === '✅ SECURE') status = '⚠️  WARNING';
                  details.push(`Missing security header: ${header}`);
                }
              });
            }

            // Check CORS
            if (test.checkCORS) {
              if (headers['access-control-allow-origin'] === '*') {
                status = '⚠️  WARNING';
                details.push('Overly permissive CORS policy');
              }
            }

            resolve({
              name: test.name,
              status: status,
              statusCode: res.statusCode,
              details: details,
              responseSize: data.length
            });
          });
        });

        req.on('error', () => {
          resolve({
            name: test.name,
            status: '❌ ERROR',
            statusCode: 'ERROR',
            details: ['Request failed'],
            responseSize: 0
          });
        });

        req.setTimeout(5000, () => {
          req.destroy();
          resolve({
            name: test.name,
            status: '⏰ TIMEOUT',
            statusCode: 'TIMEOUT',
            details: ['Request timed out'],
            responseSize: 0
          });
        });
      });

      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error testing ${test.name}:`, error);
    }
  }

  // Generate security report
  console.log('\n🔒 Security Test Results:\n');
  console.log('| Test Name | Status | Status Code | Details |');
  console.log('|-----------|--------|-------------|---------|');

  results.forEach(result => {
    const details = result.details.length > 0 ? result.details.join('; ') : 'No issues detected';
    console.log(`| ${result.name.padEnd(25)} | ${result.status.padEnd(12)} | ${result.statusCode.toString().padEnd(11)} | ${details} |`);
  });

  // Security summary
  const secureCount = results.filter(r => r.status === '✅ SECURE').length;
  const warningCount = results.filter(r => r.status === '⚠️  WARNING').length;
  const vulnerableCount = results.filter(r => r.status === '❌ VULNERABLE').length;
  const errorCount = results.filter(r => r.status.includes('ERROR') || r.status.includes('TIMEOUT')).length;

  console.log('\n🛡️  Security Summary:');
  console.log(`• Secure: ${secureCount}/${results.length}`);
  console.log(`• Warnings: ${warningCount}/${results.length}`);
  console.log(`• Vulnerabilities: ${vulnerableCount}/${results.length}`);
  console.log(`• Errors: ${errorCount}/${results.length}`);

  if (vulnerableCount === 0) {
    console.log('✅ No critical vulnerabilities detected!');
  } else {
    console.log('❌ Critical vulnerabilities found - immediate attention required!');
  }
}

// Authentication bypass tests
async function authBypassTest() {
  console.log('\n🔐 Testing Authentication Bypass...\n');

  const protectedPaths = [
    '/admin',
    '/admin/users',
    '/admin/products',
    '/admin/orders',
    '/api/admin/stats',
    '/profile',
    '/orders',
    '/account/settings'
  ];

  const results = [];

  for (const path of protectedPaths) {
    try {
      const result = await new Promise((resolve) => {
        const req = http.get(`http://localhost:3002${path}`, (res) => {
          resolve({
            path: path,
            statusCode: res.statusCode,
            authenticated: res.statusCode === 200,
            redirected: res.statusCode === 302 || res.statusCode === 301,
            denied: res.statusCode === 401 || res.statusCode === 403
          });
        });

        req.on('error', () => {
          resolve({ path: path, statusCode: 'ERROR', authenticated: false, redirected: false, denied: false });
        });
      });

      results.push(result);
    } catch (error) {
      console.error(`Error testing ${path}:`, error);
    }
  }

  console.log('🔐 Authentication Bypass Test Results:');
  console.log('| Protected Path | Status Code | Access Status |');
  console.log('|----------------|-------------|---------------|');

  results.forEach(result => {
    let accessStatus = '';
    if (result.authenticated) accessStatus = '❌ BYPASS - Accessible without auth';
    else if (result.redirected) accessStatus = '✅ SECURE - Redirected to login';
    else if (result.denied) accessStatus = '✅ SECURE - Access denied';
    else accessStatus = '⚠️  UNKNOWN - Unexpected response';

    console.log(`| ${result.path.padEnd(18)} | ${result.statusCode.toString().padEnd(11)} | ${accessStatus} |`);
  });
}

// Rate limiting test
async function rateLimitTest() {
  console.log('\n⚡ Testing Rate Limiting...\n');

  const endpoint = 'http://localhost:3002/api/auth/session';
  const rapidRequests = 20;
  const promises = [];

  console.log(`Sending ${rapidRequests} rapid requests to ${endpoint}...`);

  for (let i = 0; i < rapidRequests; i++) {
    promises.push(new Promise((resolve) => {
      const start = Date.now();
      const req = http.get(endpoint, (res) => {
        resolve({
          requestNumber: i + 1,
          statusCode: res.statusCode,
          responseTime: Date.now() - start,
          rateLimited: res.statusCode === 429
        });
      });

      req.on('error', () => {
        resolve({ requestNumber: i + 1, statusCode: 'ERROR', responseTime: 0, rateLimited: false });
      });
    }));
  }

  const results = await Promise.all(promises);
  const rateLimitedRequests = results.filter(r => r.rateLimited).length;
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

  console.log('⚡ Rate Limiting Test Results:');
  console.log(`• Total Requests: ${rapidRequests}`);
  console.log(`• Rate Limited Responses: ${rateLimitedRequests}`);
  console.log(`• Average Response Time: ${avgResponseTime.toFixed(1)}ms`);

  if (rateLimitedRequests > 0) {
    console.log('✅ Rate limiting is working');
  } else {
    console.log('⚠️  No rate limiting detected - consider implementing');
  }
}

// Run all security tests
async function runAllSecurityTests() {
  try {
    await securityTest();
    await authBypassTest();
    await rateLimitTest();
    console.log('\n🎉 All security tests completed!');
  } catch (error) {
    console.error('❌ Security test execution failed:', error);
  }
}

runAllSecurityTests();