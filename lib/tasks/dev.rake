namespace :dev do
  desc 'start dev server'
  task :start do
    exec 'foreman start -f Procfile.dev'
  end
end
