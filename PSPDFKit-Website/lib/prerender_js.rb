# When doing a partial build (e.g. when archiving the guides), the `.tmp` folder containing
# the webpack-generated assets is not automatically merged into the build folder as it is
# when doing a full build. The css assets *are* copied over due to an extra before_build
# callback that Middleman registers to provide Compass support: https://git.io/fNPIU
#
# Here we use the same approach to ensure that js assets are also copied over during a
# partial build.

class PrerenderJs < ::Middleman::Extension
  def before_build(builder)
    logger.debug '== Prerendering JS'

    builder.queue_current_paths

    js_files =
      ::Middleman::Util.instrument 'builder.prerender.output' do
        resources =
          @app.sitemap.resources.select do |resource|
            resource.ext == '.js'
          end
        builder.output_resources(resources)
      end

    js_files
  end
end

::Middleman::Extensions.register(:prerender_js, PrerenderJs)
