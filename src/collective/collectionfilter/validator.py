# -*- coding: utf-8 -*-
from Acquisition import aq_base
from Acquisition import aq_inner
from Acquisition import aq_parent
from collective.collectionfilter import _
from collective.collectionfilter.interfaces import ICollectionFilterBaseSchema
from collective.collectionfilter.interfaces import ICollectionFilterBrowserLayer
from plone.dexterity.interfaces import IDexterityContent
from z3c.form import validator
from z3c.form.interfaces import IValidator
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.component import queryUtility
from zope.interface import implementer
from zope.interface import Interface
from zope.interface import Invalid
from zope.schema.interfaces import IField


@implementer(IValidator)
@adapter(Interface, ICollectionFilterBrowserLayer, Interface, IField, Interface)
class TargetCollectionValidator(validator.SimpleFieldValidator):

    def validate(self, value):
        super(TargetCollectionValidator, self).validate(value)

        current_context = self.context

        while True:
            if IDexterityContent.providedBy(current_context):
                break
            current_context = aq_parent(current_context)

        if not hasattr(aq_base(current_context), 'query'):
            raise Invalid(_(u'Context is not a collection, please set a target collection.'))
        return True


validator.WidgetValidatorDiscriminators(TargetCollectionValidator,
                                        field=ICollectionFilterBaseSchema['target_collection'])
