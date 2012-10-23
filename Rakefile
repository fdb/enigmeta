task :default => [:rebuild]

desc 'Remove old _site and rebuild'
task :rebuild do
  sh 'rm -rf _site'
  sh 'time jekyll'
end

desc 'Deploy to the live server'
task :deploy => [:rebuild] do
  sh 'rsync -rtz --delete _site/ enigmeta.com:/www/enigmeta.com/public_html/'
end

desc 'Run Jekyll in server mode'
task :server do
  sh 'jekyll --auto --server'
end
