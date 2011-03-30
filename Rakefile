desc 'Remove old _site and rebuild'
task :default do
  sh 'rm -rf _site'
  sh 'time jekyll'
end

desc 'Run Jekyll in server mode'
task :server do
  sh 'jekyll --auto --server'
end
