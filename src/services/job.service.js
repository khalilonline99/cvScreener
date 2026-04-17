const jobs = {};

export function createJob(fileName, buffer) {
  const jobId = Date.now() + "-" + fileName;

  jobs[jobId] = {
    fileName,
    status: "processing",
    buffer,
  };

  return jobId;
}

export function updateJob(jobId, data) {
  if (jobs[jobId]) {
    jobs[jobId] = { ...jobs[jobId], ...data };
  }
}

export function getJob(jobId) {
  return jobs[jobId];
}

export function getAllJobs() {
  return jobs;
}