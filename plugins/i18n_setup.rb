require "i18n"

# Ensure Stringex can operate without raising about locales when generating slugs.
I18n.config.available_locales = [:en, :'zh', :'zh-CN', :'zh-cn']
I18n.config.enforce_available_locales = false
