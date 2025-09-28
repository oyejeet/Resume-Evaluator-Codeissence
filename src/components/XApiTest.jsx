import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, CheckCircle, XCircle, Loader } from 'lucide-react';
import xApiService from '@/services/xApiService';

const XApiTest = () => {
  const [testStatus, setTestStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const testXConnection = async () => {
    setIsTesting(true);
    setTestStatus(null);
    
    try {
      const result = await xApiService.testConnection();
      setTestResult(result);
      setTestStatus(result.success ? 'success' : 'error');
    } catch (error) {
      setTestResult({ success: false, error: error.message });
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  const testJobPosting = async () => {
    setIsTesting(true);
    setTestStatus(null);
    
    try {
      const testJobData = {
        title: 'Test Job Posting',
        company: 'Test Company',
        location: 'Remote',
        job_type: 'Full-time',
        salary: '$80,000 - $100,000',
        description: 'This is a test job posting to verify X API integration.',
        skills: ['React', 'Node.js', 'JavaScript']
      };

      const result = await xApiService.postJobListing(testJobData);
      setTestResult(result);
      setTestStatus(result.success ? 'success' : 'error');
    } catch (error) {
      setTestResult({ success: false, error: error.message });
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-green/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-theme-green flex items-center">
            <Twitter className="h-5 w-5 mr-2" />
            X API Integration Test
          </CardTitle>
          <CardDescription className="text-theme-green/70">
            Test the X (Twitter) API integration for job posting
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={testXConnection}
              disabled={isTesting}
              className="bg-gradient-to-r from-theme-cyan to-theme-cyan-light text-theme-black hover:from-theme-cyan-light hover:to-theme-cyan"
            >
              {isTesting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <Button
              onClick={testJobPosting}
              disabled={isTesting}
              className="bg-gradient-to-r from-theme-green to-theme-green-light text-theme-black hover:from-theme-green-light hover:to-theme-green"
            >
              {isTesting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Job Posting'
              )}
            </Button>
          </div>

          {testStatus && (
            <div className="bg-theme-black/30 rounded-xl p-6 border border-theme-green/20">
              <div className="flex items-center mb-4">
                {testStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-theme-green mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-theme-orange mr-2" />
                )}
                <h3 className="text-lg font-semibold text-theme-green">
                  {testStatus === 'success' ? 'Test Successful!' : 'Test Failed'}
                </h3>
              </div>
              
              {testResult && (
                <div className="space-y-2">
                  <div className="text-sm text-theme-green/80">
                    <strong>Status:</strong> {testResult.success ? 'Success' : 'Failed'}
                  </div>
                  
                  {testResult.success && testResult.data && (
                    <div className="text-sm text-theme-green/80">
                      <strong>Response:</strong> {JSON.stringify(testResult.data, null, 2)}
                    </div>
                  )}
                  
                  {testResult.error && (
                    <div className="text-sm text-theme-orange/80">
                      <strong>Error:</strong> {testResult.error}
                    </div>
                  )}
                  
                  {testResult.message && (
                    <div className="text-sm text-theme-green/80">
                      <strong>Message:</strong> {testResult.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="bg-theme-black/30 rounded-xl p-6 border border-theme-cyan/20">
            <h3 className="text-lg font-semibold text-theme-cyan mb-4">API Configuration</h3>
            <div className="space-y-2 text-sm text-theme-cyan/80">
              <div><strong>Base URL:</strong> https://api.twitter.com/2</div>
              <div><strong>Bearer Token:</strong> Configured ✓</div>
              <div><strong>Endpoints:</strong></div>
              <ul className="ml-4 space-y-1">
                <li>• POST /tweets - Create tweets</li>
                <li>• GET /users/me - Get user profile</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XApiTest;
