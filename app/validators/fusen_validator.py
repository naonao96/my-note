import app.common.messages as msg
import app.common.consts as consts
from datetime import datetime
from app.models.fusen_model import Fusen
from app.common.exceptions import FusenNotFoundError,ValidationError

def vld_content(content : str | None) -> None:
    '''
    付箋内容バリデーション(Null,空文字,MaxLength(101文字以上)の場合：False)
    エラーメッセージを渡す
    '''
    if not isinstance(content, str):
        raise ValidationError(msg.FUSEN_CONTENTS_NULL_ERROR)
    if content.strip() == "":
        raise ValidationError(msg.FUSEN_CONTENTS_NULL_ERROR)
    if len(content) > 100:
        raise ValidationError(msg.FUSEN_CONTENTS_LENGTH_ERROR)

def vld_color(color: str | None) -> None:
    '''
    付箋カラーバリデーション(Null,空文字,想定していない文字コードの場合：False)
    エラーメッセージを渡す
    '''
    if not isinstance(color, str):
        raise ValidationError(msg.FUSEN_COLOR_ERROR)
    if color not in consts.ALLOWED_FUSEN_COLORS:
        raise ValidationError(msg.FUSEN_COLOR_ERROR)

def vld_expires_at(expires_at: str | None) -> None:
    '''
    付箋期限バリデーション(想定していない日付フォーマットの場合：False)
    フォーマット：YYYY-MM-DD
    エラーメッセージを渡す
    '''
    if expires_at is None:
        return
    if not isinstance(expires_at, str):
        raise ValidationError(msg.FUSEN_EXPIRES_AT_ERROR)

    try:
        datetime.strptime(expires_at, "%Y-%m-%d")
    except ValueError:
        raise ValidationError(msg.FUSEN_EXPIRES_AT_ERROR)

def fusen_data_exist_check(fusen_data : Fusen | None) -> None:
    '''
    付箋データの存在チェック
    '''
    if fusen_data is None:
        raise FusenNotFoundError(msg.FUSEN_DATA_READ_ERROR)
