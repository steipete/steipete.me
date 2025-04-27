require 'test_helper'
require 'highlighter'

class HighlighterTest < Minitest::Test
  def test_highlight
    exp = '<div class="code-block lang-js " data-controller="clipboard"'
    act = Highlighter.highlight('', 'js')[0...60]
    assert_equal exp, act
  end

  def test_language_for_lexer
    assert_equal 'jsx', Highlighter.language_for_lexer('javascript')
    assert_equal 'jsx', Highlighter.language_for_lexer('es')
    assert_equal 'cpp', Highlighter.language_for_lexer('djinni')
    assert_equal 'xml', Highlighter.language_for_lexer('xaml')
    assert_equal 'bash', Highlighter.language_for_lexer('npm')
    assert_equal 'bash', Highlighter.language_for_lexer('rails')
  end

  def test_determine_language_from_filename
    assert_equal 'javascript',
                 Highlighter.determine_language_from_filename('test.js')
    assert_equal 'c',
                 Highlighter.determine_language_from_filename(
                   'test.csharp'
                 )
    assert_equal 'objc',
                 Highlighter.determine_language_from_filename('test.m')
    assert_equal 'yml',
                 Highlighter.determine_language_from_filename('test.yml')
    assert_equal 'html',
                 Highlighter.determine_language_from_filename('test.html')
  end

  def test_language_to_name
    assert_equal 'JavaScript', Highlighter.language_to_name('js')
    assert_equal 'ES6+', Highlighter.language_to_name('es')
    assert_equal 'Objective-C', Highlighter.language_to_name('objc')
    assert_equal 'YAML', Highlighter.language_to_name('yml')
    assert_equal 'Node.js', Highlighter.language_to_name('nodejs')
    assert_equal 'Java', Highlighter.language_to_name('java')
  end
end
