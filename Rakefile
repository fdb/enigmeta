task :default => [:rebuild]

desc 'Remove old _site and rebuild'
task :rebuild do
  sh 'rm -rf _site'
  sh 'time jekyll build'
end

desc 'Deploy to the live server'
task :deploy => [:rebuild] do
  sh 'rsync -rtz -e \'ssh -p 2242\' --delete _site/ enigmeta.com:/www/enigmeta.com/public_html/'
end

desc 'Run Jekyll in server mode'
task :server do
  sh 'jekyll serve --watch'
end
