import app.common.messages as msg
from app.models.fusen_model import Fusen

'''
付箋内容バリデーション(Null,空文字,MaxLength(101文字以上)の場合：False)
エラーメッセージを渡す
'''
def vld_content(content : str | None) -> None:
    if content is None or content.strip() == "":
        raise Exception(msg.FUSEN_CONTENTS_NULL_ERROR)
    elif len(content) > 100:
        raise Exception(msg.FUSEN_CONTENTS_LENGTH_ERROR)

def fusen_data_exist_check(fusen_data : Fusen | None) -> None:
    if fusen_data is None:
        raise Exception(msg.FUSEN_DATA_READ_ERROR)
