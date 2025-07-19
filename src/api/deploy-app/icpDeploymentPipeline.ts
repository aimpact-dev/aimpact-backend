/** returns the pipeline id */
export const initICPDeploymentPipeline = async (pipelineWebhookUrl: string, projectS3Url: string) => {
  const response = await fetch(pipelineWebhookUrl, {
      method: 'POST',
      body: JSON.stringify({
        'branch': 'main',
        'parameters': {
          'project_s3_url': projectS3Url,
        },
      }),
    },
  );
  if (!response.ok) {
    throw new Error('Failed to initialize ICP deployment pipeline');
  }

  const data = await response.json();

  return data.id as string;
};