require 'rouge'
require 'fileutils'
require 'digest/md5'

HIGHLIGHT_CACHE_DIR = File.expand_path('../../.highlight-cache', __FILE__)
FileUtils.mkdir_p(HIGHLIGHT_CACHE_DIR)

module HighlightCode
  LANGUAGE_ALIASES = {
    'ru' => 'ruby',
    'm'  => 'objective-c',
    'pl' => 'perl',
    'yml'=> 'yaml'
  }.freeze

  def highlight(code, language)
    normalized = normalize_language(language)
    cached_highlight(code, normalized)
  end

  def cached_highlight(code, language)
    cache_key = File.join(HIGHLIGHT_CACHE_DIR, "#{language}-#{Digest::MD5.hexdigest(code)}.html")
    return File.read(cache_key) if File.exist?(cache_key)

    highlighted = highlight_with_rouge(code, language)
    File.write(cache_key, highlighted)
    highlighted
  end

  def highlight_with_rouge(code, language)
    lexer = Rouge::Lexer.find_fancy(language, code) || Rouge::Lexers::PlainText
    formatter = Rouge::Formatters::HTML.new
    highlighted = formatter.format(lexer.lex(code))
    tableize_code(highlighted, lexer.tag)
  end

  def normalize_language(language)
    lang = language.to_s.strip.downcase
    LANGUAGE_ALIASES.fetch(lang, lang.empty? ? 'plaintext' : lang)
  end

  def tableize_code(str, lang = '')
    table = '<div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers">'
    code = ''
    str.lines.each_with_index do |line, index|
      table += "<span class='line-number'>#{index + 1}</span>\n"
      code  += "<span class='line'>#{line}</span>"
    end
    table += "</pre></td><td class='code'><pre><code class='#{lang}'>#{code}</code></pre></td></tr></table></div>"
  end
end
