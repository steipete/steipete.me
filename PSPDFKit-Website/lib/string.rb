ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.acronym 'PSPDFKit'
  inflect.acronym 'PDF'
  inflect.acronym 'PDFs'
  inflect.acronym 'API'
  inflect.acronym 'FAQ'
end

class String
  def titleize
    exclusions = %w[and the for]

    unless exclusions.present?
      return ActiveSupport::Inflector.titleize(self)
    end
    self.underscore.humanize.gsub(
      /\b(?<!['’`])(?!(#{exclusions.join('|')})\b)[a-z]/
    ) { $&.capitalize }
  end
end
