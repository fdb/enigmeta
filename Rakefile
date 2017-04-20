task :default => [:server]

desc 'Build the entire site and store the result in _site.'
task :build do
  sh 'rm -rf _site'
  sh 'time bundle exec jekyll build'
end

desc 'Run Jekyll in server mode'
task :server do
  sh 'bundle exec jekyll serve'
end
