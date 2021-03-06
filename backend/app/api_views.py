from rest_framework import viewsets
from . import models as models
from . import db_utilities as dbutilities
from bson.objectid import ObjectId
from . import api_serializers as api_ser
from django.views.decorators.csrf import csrf_exempt 
from rest_framework.decorators import api_view
from rest_framework.response import Response

LANGS = ['en','es','zh-tw','zh-cn']

''' e.g. http://localhost:9900/read_mycollection_bylang/en '''
@csrf_exempt
@api_view(['GET'])
def read_mycollection_bylang(request, language):   
    global LANGS
    if request.method == 'GET':
        data_list = []
        db_obj = dbutilities.db_util('mycollection', language)
        db_data = db_obj.read_documents_bylang('field2')       
        for doc in db_data:  
            formated_doc= models.myModel( 
                dbutilities.getIdString( doc, '_id'),
                dbutilities.getFieldString( doc, 'field1'),
                dbutilities.getFieldDict( doc, 'field2', LANGS ),
                dbutilities.getFieldDatetime( doc, 'field3'),
                dbutilities.getFieldDecimal( doc, 'field4')
            )
            data_list.append(formated_doc)            
        serializedList = api_ser.mySerializer(data_list, many=True)
        return Response(serializedList.data)
    else:
        return Response({'status':'read_mycollection_bylang fail'})

''' e.g. http://localhost:9900/read_mycollection_all '''
@csrf_exempt
@api_view(['GET'])
def read_mycollection_all(request):  
    global LANGS 
    if request.method == 'GET':
        data_list = []
        db_obj = dbutilities.db_util('mycollection', 'alllang')
        db_data = db_obj.read_documents_all('_id')       
        for doc in db_data:  
            formated_doc= models.myModel( 
                dbutilities.getIdString( doc, '_id'),
                dbutilities.getFieldString( doc, 'field1'),
                dbutilities.getFieldDict( doc, 'field2', LANGS ),
                dbutilities.getFieldDatetime( doc, 'field3'),
                dbutilities.getFieldDecimal( doc, 'field4')
            )
            data_list.append(formated_doc)            
        serializedList = api_ser.mySerializer(data_list, many=True)
        return Response(serializedList.data)
    else:
        return Response({'status':'read_mycollection_all fail'})

''' e.g. http://localhost:9900/read_mycollection_byid/5e461002d069ba45a5fbe9da '''
@api_view(['GET'])
def read_mycollection_byid(request, id):   
    global LANGS
    if request.method == 'GET':
        formated_doc = None
        db_obj = dbutilities.db_util('mycollection', 'alllang')
        doc = db_obj.read_document(id)
        if doc is None:
            return Response({'status':'read_mycollection_byid no document'})
        else:      
            formated_doc= models.myModel( 
                dbutilities.getIdString( doc, '_id'),
                dbutilities.getFieldString( doc, 'field1'),
                dbutilities.getFieldDict( doc, 'field2', LANGS ),
                dbutilities.getFieldDatetime( doc, 'field3'),
                dbutilities.getFieldDecimal( doc, 'field4')
            )       
            serializedList = api_ser.mySerializer(formated_doc, many=False)
            return Response(serializedList.data)   
    else:
        return Response({'status':'read_mycollection_byid fail'})

'''
e.g. http://localhost:9900/create_doc_in_mycollection_return_newone/
request.data = { 
    "_id": "5d53ca1d72be9fe767779e70", 
    "field1" : "test value 1", 
    "field2" : {"en":"test value 2", "zh-tw":"test value 3" },
    "field3" : "2020-01-01T00:00:00Z",
    "field4" : 2.34
}
'''
@api_view(['POST'])
def create_doc_in_mycollection_return_newone(request):
    global LANGS
    serialized = api_ser.mySerializer(data = request.data)
    if serialized.is_valid():
        reqId = request.data.get("_id")
        if reqId != None:
            tempdict = request.data.pop('_id')  
        db_obj = dbutilities.db_util('mycollection','alllang')     
        inserted_ids = db_obj.create_documents([request.data])
        
        newdoc = None
        if(len(inserted_ids) > 0):
            newdoc = db_obj.read_document(inserted_ids[0])

        if newdoc is None:
            return Response({'status':'create_doc_in_mycollection_return_newone no doc is created'})
        else:      
            formated_doc= models.myModel( 
                dbutilities.getIdString( newdoc, '_id'),
                dbutilities.getFieldString( newdoc, 'field1'),
                dbutilities.getFieldDict( newdoc, 'field2', LANGS ),
                dbutilities.getFieldDatetime( newdoc, 'field3'),
                dbutilities.getFieldDecimal( newdoc, 'field4')
            )       
            serializedList = api_ser.mySerializer(formated_doc, many=False)
            return Response(serializedList.data)   
    else:
        return Response(serialized._errors)


'''
e.g. http://localhost:9900/replace_doc_in_mycollection_return_newone/
request.data = { 
    "_id": "5e48e8a3e4b170032598bf1a", 
    "field1" : "test value 1", 
    "field2" : {"es":"test value es", "zh-cn":"test value cn" },
    "field3" : "2020-01-01T00:00:00Z",
    "field4" : 2.34
}
'''
@api_view(['POST'])
def replace_doc_in_mycollection_return_newone(request):
    global LANGS
    serialized = api_ser.mySerializer(data = request.data)
    if serialized.is_valid():
        reqId = request.data.get("_id")
        filterId = {'_id': ObjectId(reqId)}
        if reqId != None:
            tempdict = request.data.pop('_id')
        replacedata = request.data
        db_obj = dbutilities.db_util('mycollection', 'alllang')      
        modified_count = db_obj.replace_document(filterId, replacedata)
        newdoc = None
        if(modified_count > 0):
            newdoc = db_obj.read_document(reqId)
        if newdoc is None:
            return Response({'status':'replace_doc_in_mycollection_return_newone no doc id replaced'})
        else:      
            formated_doc= models.myModel( 
                dbutilities.getIdString( newdoc, '_id'),
                dbutilities.getFieldString( newdoc, 'field1'),
                dbutilities.getFieldDict( newdoc, 'field2', LANGS ),
                dbutilities.getFieldDatetime( newdoc, 'field3'),
                dbutilities.getFieldDecimal( newdoc, 'field4')
            )       
            serializedList = api_ser.mySerializer(formated_doc, many=False)
            return Response(serializedList.data)   
    else:
        return Response(serialized._errors)

''' 
e.g. http://localhost:9900/delete_doc_in_mycollection_return_count/
request.data = {"_id": "5e48e8a3e4b170032598bf1b"} 
'''
@api_view(['POST'])
def delete_doc_in_mycollection_return_count(request):
    serialized = api_ser.mySerializer(data = request.data)
    if serialized.is_valid():
        reqId = request.data.get("_id")
        filterId = {'_id': ObjectId(reqId)}
        db_obj = dbutilities.db_util('mycollection', 'alllang')        
        deleted_count = db_obj.delete_documents(filterId)
        if deleted_count is None:
            return Response({'status':'delete_doc_in_mycollection_return_count no doc is deleted'})
        else:
            return Response({
                'status':'delete_doc_in_mycollection_return_count success',
                'data' : deleted_count
            })
    else:
        return Response(serialized._errors)
